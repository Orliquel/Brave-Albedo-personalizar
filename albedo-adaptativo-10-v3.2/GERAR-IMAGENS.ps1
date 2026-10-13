$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$calibration = Get-Content (Join-Path $root 'calibracao.json') -Raw | ConvertFrom-Json
$reference = [Drawing.Image]::FromFile((Join-Path $root 'recursos/albedo-faixa.png'))
function Smooth-Factor([double]$Distance, [double]$Fade) {
    $t = [Math]::Max(0, [Math]::Min(1, $Distance / $Fade))
    return $t * $t * (3 - 2 * $t)
}
function New-TabArt([int]$TabWidth) {
    $artWidth = $TabWidth - [int]$calibration.margemDireitaArte
    $art = [Drawing.Bitmap]::new($artWidth, 32, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $artGraphics = [Drawing.Graphics]::FromImage($art)
    try {
        $artGraphics.Clear([Drawing.Color]::Transparent)
        $artGraphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $artGraphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        # Expandir o recorte à esquerda preserva a escala e o alinhamento do rosto.
        $sourceWidth = $artWidth * 1010.0 / 130.0
        $source = [Drawing.RectangleF]::new([single](1770 - $sourceWidth), 228, [single]$sourceWidth, 248)
        $artGraphics.DrawImage($reference, [Drawing.RectangleF]::new(0, 0, $artWidth, 32), $source, [Drawing.GraphicsUnit]::Pixel)
    } finally { $artGraphics.Dispose() }
    for ($y = 0; $y -lt $art.Height; $y++) {
        for ($x = 0; $x -lt $art.Width; $x++) {
            $color = $art.GetPixel($x, $y)
            $factor = (Smooth-Factor $x 24) * (Smooth-Factor ($art.Width - 1 - $x) 12) * (Smooth-Factor $y 2) * (Smooth-Factor ($art.Height - 1 - $y) 3)
            $art.SetPixel($x, $y, [Drawing.Color]::FromArgb([int][Math]::Round($color.A * $factor), $color.R, $color.G, $color.B))
        }
    }
    return ,$art
}
$preview = New-TabArt 248
$preview.Save((Join-Path $root 'recursos/albedo-integrada.png'), [Drawing.Imaging.ImageFormat]::Png)
$preview.Dispose()
try {
    foreach ($profile in $calibration.larguras) {
        $width = [int]$profile.larguraJanela
        for ($count = 1; $count -le 5; $count++) {
            $folder = if ($width -eq 1280) { [string]$count } else { "2560-$count" }
            $images = Join-Path $root "temas/$folder/images"
            [IO.Directory]::CreateDirectory($images) | Out-Null
            Copy-Item -LiteralPath (Join-Path $root 'recursos/frame.png') -Destination (Join-Path $images 'theme-frame.png') -Force
            $bitmap = [Drawing.Bitmap]::new($width, 160)
            $graphics = [Drawing.Graphics]::FromImage($bitmap)
            try {
                $graphics.Clear([Drawing.Color]::FromArgb(11, 8, 12))
                $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $wine = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(23, 12, 18))
                $graphics.FillRectangle($wine, 0, 16, $bitmap.Width, 38)
                $wine.Dispose()
                $positions = $profile.limitesDireitosPorQuantidade.PSObject.Properties[[string]$count].Value
                $leftPositions = $profile.limitesEsquerdosPorQuantidade.PSObject.Properties[[string]$count].Value
                if ($positions.Count -ne $count -or $leftPositions.Count -ne $count) { throw "A calibração de $width pixels não tem os limites das $count abas." }
                for ($index = 0; $index -lt $count; $index++) {
                    $left = [int]$leftPositions[$index]
                    $art = New-TabArt ([int]$positions[$index] - $left)
                    try {
                        $graphics.DrawImage($art, $left, [int]$calibration.deslocamentoVertical, $art.Width, $art.Height)
                    } finally { $art.Dispose() }
                }
            } finally { $graphics.Dispose() }
            $bitmap.Save((Join-Path $images 'theme-toolbar.png'), [Drawing.Imaging.ImageFormat]::Png)
            $bitmap.Dispose()
        }
    }
} finally { $reference.Dispose() }
Write-Output 'Geradas 10 variantes calibradas para janelas de 1280 e 2560 pixels, com 1 a 5 abas. Recarregue o controlador e os 11 temas no Brave.'

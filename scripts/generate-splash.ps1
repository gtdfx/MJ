# Generates iOS/Apple touch startup (splash) images from the white logo:
# brand charcoal background, centered emblem, ETHIO-CAN wordmark and
# GEMSTONES subtitle. Covers the common iPhone/iPad sizes.
# Run from the project root:
#   powershell -ExecutionPolicy Bypass -File scripts/generate-splash.ps1
Add-Type -AssemblyName System.Drawing

$root = Join-Path $PSScriptRoot ".."
$srcPath = Join-Path $root "public/images/logo-white.png"
$outDir = Join-Path $root "public/splash"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$src = [System.Drawing.Image]::FromFile($srcPath)
$bg = [System.Drawing.Color]::FromArgb(26, 26, 26)      # brand charcoal #1A1A1A
$gold = [System.Drawing.Color]::FromArgb(201, 169, 110) # brand gold #C9A96E
$white = [System.Drawing.Color]::White

function New-Splash($width, $height, $name) {
  $bmp = New-Object System.Drawing.Bitmap($width, $height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.Clear($bg)

  $scale = $width / 100.0   # design in a 100-wide coordinate space

  # Emblem: centered, 22 design-units
  $emblem = [int](22 * $scale)
  $emblemX = [int](($width - $emblem) / 2)
  $emblemY = [int]($height * 0.38 - $emblem / 2)
  $g.DrawImage($src, $emblemX, $emblemY, $emblem, $emblem)

  # ETHIO-CAN wordmark (serif fallback — GDI has no Cinzel; close enough at splash size)
  $fontSize = [single](7.5 * $scale)
  $font = New-Object System.Drawing.Font("Georgia", $fontSize, [System.Drawing.FontStyle]::Bold)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $textBrush = New-Object System.Drawing.SolidBrush($white)
  $textY = [single]($emblemY + $emblem + 14 * $scale)
  $g.DrawString("ETHIO-CAN", $font, $textBrush, [single]($width / 2), $textY, $sf)

  # GEMSTONES subtitle, letter-spaced gold
  $subFont = New-Object System.Drawing.Font("Georgia", [single](2.6 * $scale), [System.Drawing.FontStyle]::Regular)
  $subBrush = New-Object System.Drawing.SolidBrush($gold)
  $g.DrawString("G E M S T O N E S", $subFont, $subBrush, [single]($width / 2), ($textY + 9.5 * $scale), $sf)

  $g.Dispose()
  $outPath = Join-Path $outDir $name
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Created $name ($width x $height)"
}

# iPhone / iPad portrait + landscape (device pixel sizes)
New-Splash 640  1136 "iphone5.png"
New-Splash 750  1334 "iphone8.png"
New-Splash 828  1792 "iphonexr.png"
New-Splash 1125 2436 "iphonex.png"
New-Splash 1170 2532 "iphone12.png"
New-Splash 1179 2556 "iphone14.png"
New-Splash 1284 2778 "iphone12pro.png"
New-Splash 1290 2796 "iphone14pro.png"
New-Splash 1242 2688 "iphonexsmax.png"
New-Splash 1536 2048 "ipad.png"
New-Splash 1668 2388 "ipadpro10.png"
New-Splash 2048 2732 "ipadpro12.png"

$src.Dispose()
Write-Host "Done."

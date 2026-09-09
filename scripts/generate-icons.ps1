# Regenerates PWA icons from the white logo (padded on the brand charcoal).
# Run from the project root:
#   powershell -ExecutionPolicy Bypass -File scripts/generate-icons.ps1
Add-Type -AssemblyName System.Drawing

$root = Join-Path $PSScriptRoot ".."
$srcPath = Join-Path $root "public/images/logo-white.png"
$outDir = Join-Path $root "public/icons"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$src = [System.Drawing.Image]::FromFile($srcPath)
$bg = [System.Drawing.Color]::FromArgb(26, 26, 26) # brand charcoal #1A1A1A

# size, padding ratio (fraction of canvas kept as margin)
$sizes = @(
  @{ s = 64;  pad = 0.10 },
  @{ s = 192; pad = 0.10 },
  @{ s = 512; pad = 0.10 },
  @{ s = 180; pad = 0.08 }   # apple-touch-icon (iOS crops corners itself)
)

foreach ($cfg in $sizes) {
  $s = $cfg.s
  $bmp = New-Object System.Drawing.Bitmap($s, $s)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear($bg)

  $inner = [int]($s * (1 - 2 * $cfg.pad))
  $w = [Math]::Max(1, [int]($inner * $src.Width / [Math]::Max($src.Width, $src.Height)))
  $h = [Math]::Max(1, [int]($inner * $src.Height / [Math]::Max($src.Width, $src.Height)))
  $x = [int](($s - $w) / 2)
  $y = [int](($s - $h) / 2)
  $g.DrawImage($src, $x, $y, $w, $h)
  $g.Dispose()

  $name = if ($cfg.s -eq 180) { "apple-touch-icon.png" } else { "icon-$s.png" }
  $outPath = Join-Path $outDir $name
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Created $outPath"
}

$src.Dispose()
Write-Host "Done."

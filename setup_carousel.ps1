# PowerShell script to move generated carousel images to your project assets folder
$brainDir = "C:\Users\Ruchika\.gemini\antigravity\brain\a6d8c5a3-ef68-4506-965d-b5af45f58ada"
$assetsDir = "c:\Users\Ruchika\OneDrive\Desktop\nivora app - Copy\assets\images"

# Ensure assets directory exists
if (!(Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force
}

$images = @{
    "carousel_mindfulness_1769957543974.png" = "carousel_mindfulness.png"
    "carousel_safe_space_1769957568439.png"  = "carousel_safe_space.png"
    "carousel_community_1769957607648.png"   = "carousel_community.png"
    "carousel_breathing_1769957653490.png"   = "carousel_breathing.png"
    "carousel_reflection_1769957727219.png"  = "carousel_reflection.png"
}

foreach ($src in $images.Keys) {
    $dest = $images[$src]
    $srcPath = Join-Path $brainDir $src
    $destPath = Join-Path $assetsDir $dest
    
    if (Test-Path $srcPath) {
        Copy-Item $srcPath $destPath -Force
        Write-Host "Moved: $dest" -ForegroundColor Green
    }
    else {
        Write-Host "Warning: Source file not found: $src" -ForegroundColor Yellow
    }
}

Write-Host "`nAll images processed. Please restart your Metro bundler (press 'r' in your terminal) to see the changes." -ForegroundColor Cyan

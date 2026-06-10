$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

$folder = "c:\Users\InFaHF\Desktop\Div\Lennard\stitch_tabletop_rpg_companion\stitch_app"

Write-Host "Starting server on http://localhost:$port/..."
try {
    $listener.Start()
    Write-Host "Server successfully started."
} catch {
    Write-Host "Failed to start listener: $_"
    exit
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $rawPath = $request.Url.LocalPath
        
        Write-Host "Request: $rawPath"

        if ($rawPath -eq "/") { $rawPath = "/index.html" }
        
        # Decode URL path
        $decodedPath = [System.Uri]::UnescapeDataString($rawPath)
        if (-not $decodedPath) { $decodedPath = $rawPath }
        
        # Replace forward slashes with backslashes for Windows path safety
        $safeSubPath = $decodedPath.TrimStart('/').Replace('/', '\')
        $filePath = Join-Path $folder $safeSubPath
        
        if (Test-Path $filePath -PathType Leaf) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".webp" { "image/webp" }
                    ".jfif" { "image/jpeg" }
                    default { "application/octet-stream" }
                }
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                Write-Host "  Served: $filePath ($($bytes.Length) bytes)"
            } catch {
                Write-Host "  Error serving file $filePath : $_"
            }
        } else {
            Write-Host "  Not Found: $filePath"
            $response.StatusCode = 404
        }
        
        try {
            $response.Close()
        } catch {
            # Ignore errors closing response (e.g. client already disconnected)
        }
    } catch {
        Write-Host "Request loop exception: $_"
        Start-Sleep -Milliseconds 100
    }
}

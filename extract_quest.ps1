[xml]$xml = Get-Content 'quest_odt\content.xml' -Encoding UTF8
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace('text', 'urn:oasis:names:tc:opendocument:xmlns:text:1.0')
$paras = $xml.SelectNodes('//text:p', $ns)
$lines = $paras | ForEach-Object { $_.InnerText }
$lines | Out-File 'quest_plain.txt' -Encoding UTF8
Write-Host "Done. Lines: $($lines.Count)"

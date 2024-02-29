$envFileName = ".env.production.local"
$envOutputFile = "./public/env-config.js"

# Recreate config file
Remove-Item -Path $envOutputFile -Force
New-Item -Path $envOutputFile -ItemType File

# Add assignment 
Add-Content -Path $envOutputFile -Value "window.env = {"

# Read each line in env file
foreach ($line in Get-Content -Path $envFileName) {
    if ($line -match '=') {
        $parts = $line -split '=', 2
        $varname = $parts[0]
        $varvalue = $parts[1]

        # Read value of current variable if exists as Environment variable
        $value = [System.Environment]::GetEnvironmentVariable($varname)
        # Otherwise, use value from env file
        if (-not $value) {
            $value = $varvalue
        }
        
        # Append configuration property to JS file
        $lineToAdd = "  {0}: `"{1}`"," -f $varname, $value
        Add-Content -Path $envOutputFile -Value $lineToAdd
    }
}

Add-Content -Path $envOutputFile -Value "}"
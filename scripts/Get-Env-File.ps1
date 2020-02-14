Param(
    [string]$Env
)

$DEV = 'dev'
$PROD = 'prod'
$DEFAULT = $DEV

$ADDRESS = '192.168.137.1'
$PORT = '50001'
$LINK = 'ftp://' + $ADDRESS + ':' + $PORT + '/'

$DEV_ENV_FILE_NAME = 'dev.env'
$PROD_ENV_FILE_NAME = 'prod.env'

$LIST_ENV = @(
$DEV;
$PROD
)

function Get-EnvValidity([string] $val)
{
    foreach ($env in $LIST_ENV)
    {
        if ($val -eq $env)
        {
            return 1
        }
    }
    return 0
}

function Write-ColorOutput($ForegroundColor)
{
    # save the current color
    $fc = $host.UI.RawUI.ForegroundColor

    # set the new color
    $host.UI.RawUI.ForegroundColor = $ForegroundColor

    # output
    Write-Output $args

    # restore the original color
    $host.UI.RawUI.ForegroundColor = $fc
}

if (!$Env -or ($Env -and !(Get-EnvValidity($Env))))
{

    if ($Env -and !(Get-EnvValidity($Env)))
    {
        Write-Host '"' -NoNewLine
        Write-Host $Env -ForegroundColor Red -NoNewLine
        Write-Host '" value for argument -Env is invalid'
    }

    Write-Host 'Changing -Env value to "' -NoNewLine
    Write-Host $DEFAULT -NoNewLine -ForegroundColor Green
    Write-Host '"'

    $Env = $DEFAULT

    Write-Host 'Below are the list of the correct values for argument -Env'
    Write-Host "=========================================================="
    Write-Host "- " -NoNewline
    Write-Host "dev " -ForegroundColor Green -NoNewLine
    Write-Host "(default)"
    Write-Host "- " -NoNewline
    Write-Host "prod" -ForegroundColor Green
    Write-Host ""
}


$URI = @{
    $DEV = $LINK + $DEV_ENV_FILE_NAME;
    $PROD = $LINK + $DEV_ENV_FILE_NAME;
}

$FILE = @{
    $DEV = $DEV_ENV_FILE_NAME;
    $PROD = $PROD_ENV_FILE_NAME;
}

$url = $URI[$Env]
$path = Convert-Path "$PSScriptRoot/../"
$path = $path + $FILE[$Env]
try
{
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($url, $path)
}
catch
{
    Write-Host 'An unknown error occurred while attempting to download the .env file!'
    throw $_.Exception.Message
}

Write-ColorOutput Green ('Download .env file success!')

#!/bin/bash
# ==============================================
# Noedels & de Kip - Build Script
# Mergt alle losse JS-bestanden naar 1 HTML bestand
# ==============================================

DIST_DIR="dist"
OUTPUT="$DIST_DIR/noedels-en-de-kip.html"
JS_DIR="js"

mkdir -p "$DIST_DIR"

echo "Bouwen van $OUTPUT ..."

# Start HTML
cat > "$OUTPUT" << 'HTMLHEAD'
<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>Noedels & de Kip v3 - Avonturen in het Dorp</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#111;font-family:monospace;touch-action:none}
canvas{display:block;image-rendering:pixelated;image-rendering:crisp-edges}
#joystick-zone{display:none;position:fixed;bottom:20px;left:20px;width:160px;height:160px;pointer-events:auto;z-index:20}
#joystick-base{position:absolute;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.12);border:3px solid rgba(255,255,255,0.25);left:20px;bottom:20px}
#joystick-thumb{position:absolute;width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,0.35);border:2px solid rgba(255,255,255,0.5);left:55px;bottom:55px;transition:none}
#touch-buttons{display:none;position:fixed;bottom:20px;right:20px;pointer-events:auto;z-index:20}
.touch-action-btn{position:absolute;width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:bold;user-select:none;-webkit-user-select:none;pointer-events:auto}
#btn-action{background:rgba(240,192,64,0.35);border:3px solid rgba(240,192,64,0.6);bottom:60px;right:10px}
#btn-action:active{background:rgba(240,192,64,0.6)}
#btn-cancel{background:rgba(200,80,80,0.3);border:3px solid rgba(200,80,80,0.5);bottom:0px;right:80px}
#btn-cancel:active{background:rgba(200,80,80,0.55)}
#btn-inventory{background:rgba(100,180,255,0.25);border:2px solid rgba(100,180,255,0.45);bottom:120px;right:40px;width:48px;height:48px;font-size:12px}
#btn-minimap{position:fixed;top:10px;right:10px;width:48px;height:48px;border-radius:50%;background:rgba(100,200,100,0.25);border:2px solid rgba(100,200,100,0.45);display:none;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:bold;user-select:none;-webkit-user-select:none;pointer-events:auto;z-index:20}
@media(pointer:coarse),(max-width:900px){
  #joystick-zone{display:block}
  #touch-buttons{display:block}
  #btn-minimap{display:flex}
}
</style>
</head>
<body>
<canvas id="game"></canvas>
<div id="joystick-zone">
  <div id="joystick-base">
    <div id="joystick-thumb"></div>
  </div>
</div>
<div id="touch-buttons">
  <div class="touch-action-btn" id="btn-action">A</div>
  <div class="touch-action-btn" id="btn-cancel">B</div>
  <div class="touch-action-btn" id="btn-inventory">TAS</div>
</div>
<div id="btn-minimap">MAP</div>
<script>
HTMLHEAD

# Voeg alle JS bestanden samen (op volgorde!)
for jsfile in "$JS_DIR"/[0-9]*.js; do
  echo "" >> "$OUTPUT"
  cat "$jsfile" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
done

# Sluit HTML af
cat >> "$OUTPUT" << 'HTMLFOOT'

</script>
</body>
</html>
HTMLFOOT

# Tel regels
LINES=$(wc -l < "$OUTPUT")
SIZE=$(du -h "$OUTPUT" | cut -f1)

echo "Klaar! $OUTPUT ($LINES regels, $SIZE)"
echo ""
echo "Open met: "
echo "  file://$(cd "$(dirname "$OUTPUT")" && pwd)/$(basename "$OUTPUT")"

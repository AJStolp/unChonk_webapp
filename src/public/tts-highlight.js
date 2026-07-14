// HighlightPainter.js - Paint Worklet for rect-based TTS highlights with multi-rect support
class HighlightPainter {
  static get inputProperties() {
    return [
      "--tts-word-rects", // String: 'x1 y1 w1 h1,x2 y2 w2 h2' (multi-line support)
      "--tts-word-active", // 'true' or 'false'
      "--tts-word-color", // e.g., 'rgba(255, 255, 0, 0.4)'
      "--tts-sentence-rects",
      "--tts-sentence-active",
      "--tts-sentence-color",
      "--tts-padding-x",
      "--tts-padding-y",
      "--tts-border-radius",
    ];
  }

  paint(ctx, geom, properties) {
    const paddingX = parseFloat(properties.get("--tts-padding-x")) || 6;
    const paddingY = parseFloat(properties.get("--tts-padding-y")) || 6;
    const borderRadius = parseFloat(properties.get("--tts-border-radius")) || 6;

    const parseRects = (rectsStr) => {
      if (!rectsStr || typeof rectsStr.toString !== "function") return [];
      const str = rectsStr.toString().trim();
      if (!str) return [];
      return str
        .split(",")
        .map((rect) => rect.trim().split(" ").map(parseFloat));
    };

    const drawHighlight = (rects, color, active) => {
      if (active.toString().trim() !== "true" || !color) return;
      ctx.fillStyle = color.toString().trim();

      rects.forEach(([x, y, w, h]) => {
        const paddedX = x - paddingX;
        const paddedY = y - paddingY;
        const paddedW = w + 2 * paddingX;
        const paddedH = h + 2 * paddingY;

        ctx.beginPath();
        ctx.moveTo(paddedX + borderRadius, paddedY);
        ctx.lineTo(paddedX + paddedW - borderRadius, paddedY);
        ctx.quadraticCurveTo(
          paddedX + paddedW,
          paddedY,
          paddedX + paddedW,
          paddedY + borderRadius
        );
        ctx.lineTo(paddedX + paddedW, paddedY + paddedH - borderRadius);
        ctx.quadraticCurveTo(
          paddedX + paddedW,
          paddedY + paddedH,
          paddedX + paddedW - borderRadius,
          paddedY + paddedH
        );
        ctx.lineTo(paddedX + borderRadius, paddedY + paddedH);
        ctx.quadraticCurveTo(
          paddedX,
          paddedY + paddedH,
          paddedX,
          paddedY + paddedH - borderRadius
        );
        ctx.lineTo(paddedX, paddedY + borderRadius);
        ctx.quadraticCurveTo(paddedX, paddedY, paddedX + borderRadius, paddedY);
        ctx.closePath();
        ctx.fill();
      });
    };

    // Get rect data
    const sentenceRects = parseRects(properties.get("--tts-sentence-rects"));
    const sentenceActive = properties.get("--tts-sentence-active");
    const sentenceColor = properties.get("--tts-sentence-color");

    const wordRects = parseRects(properties.get("--tts-word-rects"));
    const wordActive = properties.get("--tts-word-active");
    const wordColor = properties.get("--tts-word-color");

    // Draw sentence background layer first
    if (sentenceActive && sentenceActive.toString().trim() === "true") {
      drawHighlight(sentenceRects, sentenceColor, sentenceActive);
    }

    // Draw word on top (higher opacity to stand out)
    if (wordActive && wordActive.toString().trim() === "true") {
      drawHighlight(wordRects, wordColor, wordActive);
    }
  }
}

registerPaint("tts-highlight", HighlightPainter);

routerAdd(
  'POST',
  '/backend/v1/parse-document',
  (e) => {
    // Mock OCR logic for identity document extraction
    // In a real app, this would extract the text from the image/PDF

    return e.json(200, {
      titular_name: 'JULIANO YUKIO WATANABE',
      titular_document: '02558157000162',
      representative_name: 'JULIANO YUKIO WATANABE',
    })
  },
  $apis.requireAuth(),
)

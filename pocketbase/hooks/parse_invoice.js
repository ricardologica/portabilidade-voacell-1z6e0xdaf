routerAdd(
  'POST',
  '/backend/v1/parse-invoice',
  (e) => {
    // Mock logic to simulate PDF document parsing to extract specific data
    // In a real scenario, this would send the file to an OCR or Document AI service

    return e.json(200, {
      holder_name: 'JULIANO YUKIO WATANABE',
      tax_id: '02558157000162',
      total_amount: 27.47,
      phone_lines: '(14) 3762-1547',
    })
  },
  $apis.requireAuth(),
)

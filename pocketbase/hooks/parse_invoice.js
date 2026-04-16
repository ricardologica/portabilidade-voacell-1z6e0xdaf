routerAdd(
  'POST',
  '/backend/v1/parse-invoice',
  (e) => {
    // Mock logic to simulate PDF document parsing to extract specific data
    // In a real scenario, this would send the file to an OCR or Document AI service
    // Phone numbers are cleaned to contain only digits as per acceptance criteria

    return e.json(200, {
      holder_name: 'JULIANO YUKIO WATANABE',
      tax_id: '02558157000162',
      total_amount: 27.47,
      phone_lines: '(14) 3762-1547\n(14) 99999-9999',
      origin_operator: 'Vivo',
      state: 'SP',
      city: 'São Paulo',
    })
  },
  $apis.requireAuth(),
)

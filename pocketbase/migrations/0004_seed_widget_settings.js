migrate(
  (app) => {
    try {
      app.findFirstRecordByData(
        'widget_settings',
        'agent_id',
        '4b83eae2-8087-4668-a956-351416480796',
      )
      return // already exists
    } catch (_) {}

    const col = app.findCollectionByNameOrId('widget_settings')
    const record = new Record(col)
    record.set('name', 'Suporte Voacell')
    record.set('agent_id', '4b83eae2-8087-4668-a956-351416480796')
    record.set('schema', 'dd25ab83-b0f2-4832-87f5-c6a524d99f6a')
    record.set('type', 'thunderemotionlite')
    record.set('is_active', true)
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'widget_settings',
        'agent_id',
        '4b83eae2-8087-4668-a956-351416480796',
      )
      app.delete(record)
    } catch (_) {}
  },
)

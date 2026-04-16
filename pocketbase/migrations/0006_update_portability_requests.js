migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('portability_requests')

    const statusField = col.fields.getByName('status')
    if (statusField) {
      statusField.values = ['draft', 'pending', 'analyzing', 'approved', 'rejected']
    }

    const fieldsToUnrequire = [
      'state',
      'city',
      'origin_operator',
      'numbers',
      'titular_name',
      'titular_document',
    ]
    for (const name of fieldsToUnrequire) {
      const f = col.fields.getByName(name)
      if (f) f.required = false
    }

    if (!col.fields.getByName('representative_name')) {
      col.fields.add(new TextField({ name: 'representative_name' }))
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('portability_requests')

    const statusField = col.fields.getByName('status')
    if (statusField) {
      statusField.values = ['pending', 'analyzing', 'approved', 'rejected']
    }

    const fieldsToRequire = [
      'state',
      'city',
      'origin_operator',
      'numbers',
      'titular_name',
      'titular_document',
    ]
    for (const name of fieldsToRequire) {
      const f = col.fields.getByName(name)
      if (f) f.required = true
    }

    const repField = col.fields.getByName('representative_name')
    if (repField) {
      col.fields.removeById(repField.id)
    }

    app.save(col)
  },
)

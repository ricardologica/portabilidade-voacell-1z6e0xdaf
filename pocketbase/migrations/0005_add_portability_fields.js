migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('portability_requests')

    if (!col.fields.getByName('holder_name')) {
      col.fields.add(new TextField({ name: 'holder_name' }))
    }
    if (!col.fields.getByName('tax_id')) {
      col.fields.add(new TextField({ name: 'tax_id' }))
    }
    if (!col.fields.getByName('total_amount')) {
      col.fields.add(new NumberField({ name: 'total_amount' }))
    }
    if (!col.fields.getByName('phone_lines')) {
      col.fields.add(new TextField({ name: 'phone_lines' }))
    }

    app.save(col)

    const widgetCol = app.findCollectionByNameOrId('widget_settings')
    if (!widgetCol.fields.getByName('placement')) {
      widgetCol.fields.add(
        new SelectField({ name: 'placement', values: ['admin', 'client', 'all'], maxSelect: 1 }),
      )
    }
    app.save(widgetCol)
  },
  (app) => {
    // down handled automatically for added fields or can be added if fully reverting is needed
  },
)

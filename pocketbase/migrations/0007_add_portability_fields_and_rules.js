migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('portability_requests')

    if (!col.fields.getByName('eot')) {
      col.fields.add(new TextField({ name: 'eot' }))
    }
    if (!col.fields.getByName('scheduling')) {
      col.fields.add(new DateField({ name: 'scheduling' }))
    }
    if (!col.fields.getByName('ticket_number')) {
      col.fields.add(new TextField({ name: 'ticket_number' }))
    }

    // Fix 404 issue: allows clients to update their own requests when resuming or adding info
    col.updateRule =
      "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')"

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('portability_requests')
    col.fields.removeByName('eot')
    col.fields.removeByName('scheduling')
    col.fields.removeByName('ticket_number')
    col.updateRule = "@request.auth.id != '' && @request.auth.role = 'admin'"
    app.save(col)
  },
)

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    if (!users.fields.getByName('role')) {
      users.fields.add(
        new SelectField({
          name: 'role',
          values: ['client', 'admin'],
          maxSelect: 1,
          required: true,
        }),
      )
      app.save(users)
    }

    const requests = new Collection({
      name: 'portability_requests',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: users.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'state', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'origin_operator', type: 'text', required: true },
        { name: 'numbers', type: 'text', required: true },
        { name: 'titular_name', type: 'text', required: true },
        { name: 'titular_document', type: 'text', required: true },
        {
          name: 'invoice_file',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['application/pdf'],
        },
        {
          name: 'document_file',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['application/pdf'],
        },
        {
          name: 'video_auth_file',
          type: 'file',
          maxSelect: 1,
          maxSize: 52428800,
          mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'],
        },
        {
          name: 'status',
          type: 'select',
          values: ['pending', 'analyzing', 'approved', 'rejected'],
          maxSelect: 1,
          required: true,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(requests)

    const billing = new Collection({
      name: 'billing',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin')",
      createRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      updateRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      deleteRule: "@request.auth.id != '' && @request.auth.role = 'admin'",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: users.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'description', type: 'text' },
        { name: 'due_date', type: 'date' },
        { name: 'amount', type: 'number' },
        {
          name: 'file',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['application/pdf'],
        },
        { name: 'status', type: 'select', values: ['paid', 'pending', 'overdue'], maxSelect: 1 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(billing)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('billing'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('portability_requests'))
    } catch (_) {}
    try {
      const users = app.findCollectionByNameOrId('users')
      users.fields.removeByName('role')
      app.save(users)
    } catch (_) {}
  },
)

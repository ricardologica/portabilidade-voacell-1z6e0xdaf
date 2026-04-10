migrate((app) => {
  const users = app.findCollectionByNameOrId('users')

  let admin
  try {
    admin = app.findAuthRecordByEmail('users', 'ricardo.matematico@gmail.com')
  } catch (_) {
    admin = new Record(users)
    admin.setEmail('ricardo.matematico@gmail.com')
    admin.setPassword('Skip@Pass')
    admin.setVerified(true)
    admin.set('name', 'Ricardo Admin')
    admin.set('role', 'admin')
    app.save(admin)
  }

  let client
  try {
    client = app.findAuthRecordByEmail('users', 'cliente@voacell.com')
  } catch (_) {
    client = new Record(users)
    client.setEmail('cliente@voacell.com')
    client.setPassword('Skip@Pass')
    client.setVerified(true)
    client.set('name', 'Cliente Voacell')
    client.set('role', 'client')
    app.save(client)
  }

  const billing = app.findCollectionByNameOrId('billing')
  try {
    app.findFirstRecordByData('billing', 'description', 'Fatura Abril 2026')
  } catch (_) {
    const b1 = new Record(billing)
    b1.set('user_id', client.id)
    b1.set('description', 'Fatura Abril 2026')
    b1.set('due_date', '2026-04-15 12:00:00.000Z')
    b1.set('amount', 150.0)
    b1.set('status', 'pending')
    app.save(b1)
  }
})

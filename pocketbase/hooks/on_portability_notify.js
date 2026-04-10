onRecordAfterCreateSuccess((e) => {
  console.log('Nova solicitação de portabilidade criada: ', e.record.id)
  // Hook preparado para integração futura com Evolution API ou outros webhooks
  e.next()
}, 'portability_requests')

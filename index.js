#!/usr/bin/env node

const { TelegramClient } = require('telegram')
const { StringSession } = require('telegram/sessions')
const { Logger } = require('telegram/extensions')
const prompts = require('prompts')

Logger.setLevel('none')

const ask = async (message, type = 'text') => (await prompts({ type, name: 'v', message })).v;

(async () => {
  console.log('Please get your api_id and api_hash here: https://my.telegram.org/apps')

  const apiId = await ask('Please enter your api_id', 'number')
  const apiHash = await ask('Please enter your api_hash')

  const client = new TelegramClient(new StringSession(''), apiId, apiHash)

  await client.start({
    phoneNumber: async () => await ask('Please enter your phone number'),
    password: async () => await ask('Please enter your password'),
    phoneCode: async () => await ask('Please enter the received code'),
    onError: (e) => console.log(e)
  })

  const sess = client.session.save()

  await client.sendMessage('me', {
    message: `Your Gram.JS string session:\n\n<code>${sess}</code>`,
    parseMode: 'html'
  })
  console.log('Your string session:\n', sess)

  process.exit(0)
})()
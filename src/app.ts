import { Client } from 'discord.js'
import { config } from 'dotenv'
// @ts-ignore(acrylic-style): don't know why
import { LoggerFactory } from 'logger.js'
import stripAnsi from 'strip-ansi'
import Language from './language'
import db2 from './languages/db2'
import html from './languages/html'
import java from './languages/java'
import javascript from './languages/javascript'
import mariadb from './languages/mariadb'
import mysql from './languages/mysql'
import n1ql from './languages/n1ql'
import php from './languages/php'
import plsql from './languages/plsql'
import postgresql from './languages/postgresql'
import redshift from './languages/redshift'
import ruby from './languages/ruby'
import spark from './languages/spark'
import sql from './languages/sql'
import text from './languages/text'
import tsql from './languages/tsql'
import typescript from './languages/typescript'
import xml from './languages/xml'
config()

const logger = LoggerFactory.getLogger('bot', 'blue')
const client = new Client()

const languages: { [code: string]: Language } = {
  // typescript
  ts: new typescript(),
  typescript: new typescript(),

  // babel (default)
  js: new javascript(),
  javascript: new javascript(),

  // html-prettify
  html: new html(),
  htm: new html(),

  // @prettier/plugin-java
  java: new java(),

  // @prettier/plugin-xml
  xml: new xml(),
  pom: new xml(),

  // @prettier/plugin-ruby
  ruby: new ruby(),
  rb: new ruby(),
  gemspec: new ruby(),
  haml: new ruby(),

  // @prettier/plugin-php
  php: new php(),

  // sql-formatter
  sql: new sql(),
  mariadb: new mariadb(),
  mysql: new mysql(),
  postgresql: new postgresql(),
  postgres: new postgresql(),
  db2: new db2(),
  plsql: new plsql(),
  n1ql: new n1ql(),
  redshift: new redshift(),
  spark: new spark(),
  tsql: new tsql(),

  // spellchecker
  text: new text(),
  txt: new text(),
}

client.on('ready', () => {
  logger.info('Bot is ready!')
})

client.on('message', async (msg) => {
  if (msg.author.bot || msg.author.system) return
  if (!msg.mentions.users.array().find((u) => u.id === client.user?.id)) return
  const arr = /```(.*?)\n(.*)\n```/ms.exec(msg.content)
  if (!arr) return
  const language = arr[1]
  const src = arr[2]
  const instance = languages[language]
  if (!instance) {
    logger.info('Unsupported language: {}', language)
    return msg.reply('Sorry, that language is not supported (yet)!')
  }
  try {
    msg.reply(
      `${instance.notes
        .map((s) => `Note: ${s}`)
        .join('\n')}\n\`\`\`${language}\n${await instance.format(src)}\n\`\`\``
    )
  } catch (e) {
    if (e instanceof SyntaxError) {
      const se = e as SyntaxError
      msg.reply(`\`\`\`\n${stripAnsi(se.message)}\n\`\`\``)
    }
  }
})

client.login()

import clc from 'cli-color'
import { Express } from 'express'
import _ from 'lodash'
import { Api } from './api'
import { App } from './app'
import { Logger } from './logger/service'

export class Launcher {
  private logger: Logger

  constructor(private express: Express, private port: string, private app: App, private api: Api) {
    this.logger = new Logger('Launcher')
  }

  async launch() {
    this.printLogo()

    await this.app.setup()
    await this.api.setup()

    this.express.listen(this.port)

    // TODO: should channels be in api instead?
    this.printChannels()
    await this.app.channels.setupChannels()

    this.logger.info(`Server is listening at: http://localhost:${this.port}`)
    this.logger.info(`Server is exposed at: ${this.app.config.current.externalUrl}`)
  }

  private printLogo() {
    const centerText = (text: string, width: number, indent: number = 0) => {
      const padding = Math.floor((width - text.length) / 2)
      return _.repeat(' ', padding + indent) + text + _.repeat(' ', padding)
    }

    this.logger.info(
      '========================================\n' +
        clc.bold(centerText('Botpress Messaging', 40, 33)) +
        '\n' +
        clc.blackBright(centerText('Version 0.0.1', 40, 33)) +
        '\n' +
        centerText('========================================', 40, 33)
    )
  }

  private printChannels() {
    const padding = _.repeat(' ', 24)

    let enabledText = ''
    const disabledText = ''
    let enabled = 0
    for (const channel of this.app.channels.list()) {
      // TODO: should it be possible to disable channels globally?
      if (true) {
        enabled++
        enabledText += `\n${padding}${clc.green('⦿')} ${channel.name}`
      } else {
        // disabledText += `\n${padding}${clc.blackBright('⊝')} ${channel.id} ${clc.blackBright('(disabled)')}`
      }
    }

    this.logger.info(`Using ${clc.bold(enabled)} channels` + enabledText + disabledText)
  }
}

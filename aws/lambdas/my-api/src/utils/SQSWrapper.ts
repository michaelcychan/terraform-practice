import { SQS, SendMessageCommand } from '@aws-sdk/client-sqs'

export class SQSWrapper {
  private sqs: SQS
  private queueUrl: string

  constructor(queueUrl: string) {
    this.sqs = new SQS({region: 'eu-west-2'})
    this.queueUrl = queueUrl
  }

  async sendMessage(message:string): Promise<boolean> {
    const command: SendMessageCommand = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: message
    })
    try {
      await this.sqs.send(command)
      return true
    } catch (error) {
      console.error('Error sending message to SQS:', error)
      return false
    }
  }
}
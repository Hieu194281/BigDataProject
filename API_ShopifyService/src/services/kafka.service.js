const { Kafka } = require('kafkajs');

class KafkaService {
  static kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:29092'],
  });

  static producer = this.kafka.producer();

  // constructor() {
  //   this.kafka = new Kafka({
  //     clientId: 'my-app',
  //     brokers: ['localhost:29092'],
  //   });
  //   this.producer = this.kafka.producer();
  // }

  static async init() {
    await this.producer.connect().then(res => {
      console.log('Connected to Kafka: ', res);
    });
  }

  static async produceMessage(topic, message) {
    try {
      console.log(this.producer);
      await this.producer.send({
        topic,
        messages: [{ value: message }],
      });
      console.log(`Message sent to Kafka topic: ${topic}`);
    } catch (error) {
      console.error('Error sending message to Kafka:', error);
    }
  }

  static async disconnect() {
    await this.producer.disconnect();
  }
}

module.exports = KafkaService;

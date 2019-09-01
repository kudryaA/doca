import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='analyze_image_result', durable=True)


def callback(ch, method, properties, body):
    print(body)

channel.basic_consume('analyze_image_result', callback)

channel.start_consuming()
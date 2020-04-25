import keras
import base64
from PIL import Image
from io import BytesIO
import numpy as np
from flask import Flask, request, jsonify
from keras.applications import vgg16, inception_v3, resnet50, mobilenet
from keras.preprocessing.image import img_to_array
from keras.applications.imagenet_utils import decode_predictions
from threading import Thread
import test_image
import pika
import json

vgg_model = vgg16.VGG16(weights='imagenet')
#inception_model = inception_v3.InceptionV3(weights='imagenet')
#resnet_model = resnet50.ResNet50(weights='imagenet')
#mobilenet_model = mobilenet.MobileNet(weights='imagenet')

def prepareImage(data):
  original = Image.open(BytesIO(base64.b64decode(data)))
  original = original.resize((224, 224), Image.ANTIALIAS)
  numpy_image = img_to_array(original)
  image_batch = np.expand_dims(numpy_image, axis=0)
  return image_batch

def analyzeImage(image):
  processed_image = vgg16.preprocess_input(image.copy())
  predictions = vgg_model.predict(processed_image)
  labels = []
  for item in decode_predictions(predictions)[0]:
    labels.append(item[1])
  return labels

class Analyze(Thread):
    def __init__(self, id, data):
        Thread.__init__(self)
        self.id = id
        self.data = data

    def run(self):
        image = prepareImage(self.data)
        labels = analyzeImage(image)
        result = { 'id': self.id, 'value': labels }
        connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
        channel = connection.channel()
        channel.queue_declare(queue='analyze_image_result', durable=True)
        channel.basic_publish(exchange='',
                      routing_key='analyze_image_result',
                      body=json.dumps(result),
                      properties=pika.BasicProperties(
                        delivery_mode = 2
                      ))
        connection.close()

image = prepareImage(test_image.data)
labels = analyzeImage(image)

app = Flask('doca_analyze_image')
@app.route('/analyze', methods=["POST"])
def analyze():
    content = request.json
    id = content['id']
    data = content['value']
    result = { 'status': True }
    analyze = Analyze(id, data)
    analyze.start()
    return jsonify(result)


if __name__ == '__main__':
  app.run(port=1490, host='0.0.0.0')

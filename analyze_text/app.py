from sklearn.feature_extraction.text import TfidfVectorizer
from gensim.summarization import keywords
from flask import Flask, request, jsonify
import pika
import json


def analyzeText(text_en):
    text_en = text_en.replace('\n', ' ').replace('\t', ' ')
    paragraf = keywords(text_en, words = 10,scores = False, lemmatize = True).split('\n')
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(text_en.split('.'))
    res = []
    for word in list(set(paragraf+vectorizer.get_feature_names())):
        if len(word) > 3:
            res.append(word)
    return res


app = Flask('doca_analyze_text')
@app.route('/analyze', methods=["POST"])
def analyze():
    content = request.json
    id = content['id']
    data = content['value']
    labels = analyzeText(data)
    result = { 'id': id, 'value': labels }
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue='analyze_text_result', durable=True)
    channel.basic_publish(exchange='',
        routing_key='analyze_text_result',
        body=json.dumps(str(result)),
        properties=pika.BasicProperties(
        delivery_mode = 2
    ))
    connection.close()
    return jsonify({ 'status': True, 'value': labels })


if __name__ == '__main__':
  app.run(port=1491, host='0.0.0.0')
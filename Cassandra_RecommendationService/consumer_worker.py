from confluent_kafka import Consumer, KafkaError
import json
import time

MAPPING_ACTION_TO_POINT = {
    'search': 1,
    'view': 3,
    'add_to_cart': 10,
    'buy': 15
}


def write_to_hdfs(needed_information):
    # Implement this function
    pass


c = Consumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'mygroup',
    'auto.offset.reset': 'earliest',
    'enable.auto.commit': True
})

c.subscribe(['mytopic'])

while True:
    msg = c.poll(1.0)

    if msg is None:
        continue
    if msg.error():
        if msg.error().code() == KafkaError._PARTITION_EOF:
            # When reading is reaching end of file, ignore it
            continue
        else:
            print("Consumer error: {}".format(msg.error()))
            break

    print('Received message: {}'.format(msg.value().decode('utf-8')))
    try:
        # Unmarshall message event in kafka to dictionary
        message = json.loads(msg.value().decode('utf-8'))
        products = message.get("products", [])

        for product in products:
            # If product item does not have 'categories' field, skip it
            if not hasattr(product, "categories"):
                continue
            categories = product.get("categories", {})

            # If 'categories' isn't a leaf one, skip it
            if not categories.get("is_leaf", False):
                continue
            # Format message to store into HDFS
            needed_information = {
                "user_id": products.get("user_id", 0),
                "category_id": categories.get("id"),
                "point": MAPPING_ACTION_TO_POINT[products.get("action", "search")],
                "timestamp": products.get("timestamp", time.time()),
            }
            
            write_to_hdfs(needed_information)
            print(f'Completed writing to HDFS message {needed_information}')
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        continue
    except Exception as e:
        print(f"Unknown error: {e}")
        continue

c.close()
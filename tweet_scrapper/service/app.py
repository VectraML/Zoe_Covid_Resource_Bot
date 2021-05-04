''' 
This Flask API gets the keywords using which twitter will be scrapped
to generate the resource list. On the list of scrapped tweets, we do
NLP processing to supress call for help and clean the tweet list.

Input : {"message":"oxygen AND agra AND verified"}
Output : jsonified list of tweet ids  

'''

# importing important libraries
from flask import Flask, request, redirect, url_for, flash, jsonify
from flask_cors import CORS, cross_origin
import numpy as np
import twint
import json
import pickle
from io import BytesIO
from flask import send_file
import pandas as pd
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report

# Creating flask app
app = Flask(__name__)
cors = CORS(app, resources={r"/foo": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/tweets/', methods=['POST','OPTIONS'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def tweets():
    # Receiving jsonified request and converting into dataframe
    data=request.get_json()
    
    # Configuring twint for twitter scrapping
    config_twint = twint.Config()
    config_twint.Limit = 300
    config_twint.Search=data['message']
    config_twint.Pandas = True

    # Scrapping for tweets
    twint.run.Search(config_twint)

    # Storing into dataframe and selecting tweet column
    tweets_df = twint.storage.panda.Tweets_df
    tweets_content = tweets_df['tweet']

    # classifying tweets into Questions and Statements
    predict_question_list = []
    
    for col_name, data in tweets_content.items():
        predict_question = model.predict(vectorizer.transform([data]))
        if (predict_question[0] == 'ynQuestion' or predict_question[0] == 'whQuestion'):
            predict_question_list.append('Question')
        else:
            predict_question_list.append('Statement')
    tweets_df['Predict question'] = predict_question_list
    tweet_id = tweets_df['id']

    # Ignoring index of dataframe
    tweet_id.reset_index(drop=True, inplace=True)
    json_tweet_id = tweet_id.to_json()
    return (json_tweet_id)
    
if __name__ == '__main__':
    path = "./model/"
    filename_model = path + 'nlp_model.pkl'
    filename_vectorizer = path + 'vectorizer_tf.pickle'
    
    # loading trained model and vectorizer into memory 
    model = pickle.load(open(filename_model, 'rb'))
    vectorizer= pickle.load(open(filename_vectorizer, 'rb'))
    app.run(debug=True, host='0.0.0.0')
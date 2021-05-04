'''
This trainer file is used to train a machine learning model which can
classify whether a piece of text is a Question or a Statement. The 
intent behind doing this is to make sure we are not showing call for help
tweets. We have tried to ensure that no relevant leads get supressed 
during the classification process.
'''

# importing important libraries
import pandas as pd
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report
import pickle


nltk.download('nps_chat')
posts = nltk.corpus.nps_chat.xml_posts()
posts_text = [post.text for post in posts]

# divide train and test in 80 20
train_text = posts_text[:int(len(posts_text)*0.8)]
test_text = posts_text[int(len(posts_text)*0.2):]

# Get TFIDF features
vectorizer = TfidfVectorizer(ngram_range=(1, 3),
                             min_df=0.001,
                             max_df=0.7,
                             analyzer='word')

X_train = vectorizer.fit_transform(train_text)
X_test = vectorizer.transform(test_text)

y = [post.get('class') for post in posts]

y_train = y[:int(len(posts_text)*0.8)]
y_test = y[int(len(posts_text)*0.2):]

# Fitting Gradient Boosting classifier to the Training set
gb = GradientBoostingClassifier(n_estimators=400, random_state=0)
gb.fit(X_train, y_train)

# Serializing vectorizer and classifier

model_filename = 'nlp_model.pkl'
pickle.dump(gb, open(model_filename, 'wb'))

vectorizer_filename = 'vectorizer_tf.pickle'
pickle.dump(vectorizer, open(vectorizer_filename, 'wb'))

print("The training process is complete")


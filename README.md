# Covid_Resource_Tracker
Code and Design of the COVID Resource Tracker created by the Vectra Machine Learning Team

# Design

![alt text](https://github.com/VectraML/Covid_Resource_Tracker/blob/Main/source/COVID_Tracker.png?raw=true)

The whole website is made up of 3 component:
- Responsive Front End (Built using HTML, CSS and Javascript)
- RASA Chatbot API (Running on port 5005 and interacting with the front end website to generate dialogue and capture required data for scrapper)
- Twitter Scrapper and NLP to filter relevant tweets about a COVID related resource (Running on port 5000 and interacting with the front website to display the result)  

## Web Scrapper and NLP API

The tweet scrapper API makes use of the ```twint``` ```nltk``` ```sci-kit learn``` ```flask``` libraries 

### Twint Installation

To install Twint use the following command

```pip install twint```

Before using Twint, the config needs to be changed. The configuration setup is shown in the ```app.py``` file present in the ```service``` directory

### NLTK Installation

To install NLTK use the following command

```pip install nltk```

### Sci-kit Learn Installation

To install scikit-learn use the following command 

```pip install sklearn```

### Flask Installations

To install flask and flask-cors use the following commnad

```pip install flask ``` and ```pip install flask-cors```

## RASA Chatbot

### RASA Chatbot Installation

A basic rasa setup which can be built upon

All of the contents for this file have been picked up from [Rasa Masterclass](https:**//info.rasa.com/masterclass).

This is a TL;DR version. 

------------
# Installing RASA, training the chatbot and running it

1. Create a virtual environment and install RASA using

```pip install rasa```

2. Do the coversational design in the ```nlu.yml``` ```stories.yml``` ```domains.yml``` present in the directory ```chatbot```
3. Configure the pipeline in ```config.yml``` present in directory ```chatbot```
4. Train the chatbot using the command ```rasa train```
5. Once the training is done and model is saved, run the chatbot using ```rasa run --enable-api --cors "*"``` and ```rasa run actions```


------------

## Prerequisite knowledge

### What a Contextual Assistant can do?

- Able to understand the context of the conversation, i.e.  what the user has said previously and when/where/how they said it.
- Capable of understanding and responding to different and unexpected inputs
- Can learn from previous conversations and improve in accuracy over time

### Rasa has 3 basic components:

1. **Rasa NLU**
    
    Rasa NLU is like the “ear” of your assistant—it helps your assistant understand what’s being said. Rasa NLU takes user input in the form of unstructured human language and extracts structured data in the form of intents and entities.

    - **Intents** are labels that represent the goal, or meaning, of a user’s specific input. For example, the message ‘Hello’ could have the label ‘greet’ because the meaning of this message is a greeting.
    - **Entities** are important keywords that an assistant should take note of. For example, the message ‘My name is Juste’ has the name ‘Juste’ in it. An assistant should extract the name and remember it throughout the conversation to keep the interaction natural. Entity extraction is achieved by training a named entity recognition model to identify and extract the entities (in this example, names) for unstructured user messages.

2. **Rasa Core**
    
    Core is Rasa’s dialogue management component. It decides how an assistant should respond based on:
    
    1. The state of the conversation 
    2. The context
    
    Rasa Core learns by observing patterns in conversational data between users and an assistant.

3. **Rasa X**

    Rasa X is a toolset for developers to build, improve and deploy contextual assistants with the Rasa framework. You can use Rasa X to:

    1. View and annotate conversations
    2. Get feedback from testers
    3. Version and manage models

    With Rasa X, you can share your assistant with real users and collect the conversations they have with the assistant, allowing you to improve your assistant without interrupting the assistant running in production.
------------

### **Step 1:** Install Rasa

Install both Rasa (NLU and Core) and Rasa X with a single command

    pip3 install rasa-x --extra-index-url https://pypi.rasa.com/simple

If you're having issues try the following:
    
    pip install rasa-x --extra-index-url https://pypi.rasa.com/simple

    python3 -m pip install rasa-x --extra-index-url https://pypi.rasa.com/simple

Try out the command format you usually use on your device.

Make sure to use the same command format for each time you have to run a rasa command.

Eg. 

If you used ```python3 -m pip install rasa-x --extra-index-url https://pypi.rasa.com/simple``` to install

The command to run rasa would be ```python3 -m rasa ... ```

------------

### **Step 2:** Setup a base project

This command creates a new Rasa project in a local directory, which you will specify by providing the directory name.

    rasa init

Rasa will automatically populate it with the project files and example training data, and it will train the NLU and dialogue models.

By default, rasa init trains a simple assistant called moodbot which will ask you how you feel, and if you are unhappy it will try to cheer you up by sending you a picture of a cute tiger cub.

------------

### **Step 3: Conversational Design**

This represents the kind of conversations the chatbot will have with the user. The main idea of this step is to delineate the conversation flow of your assistant.

For Rasa, all of this must be setup in the following 3 files (Refer to [Rasa Docs](https://rasa.com/docs/rasa)):
1. **nlu.yml** - The file containing NLU model training examples. This includes intents, which are user goals, and example utterances that represent those intents. The NLU training data also labels the entities, or important keywords, the assistant should extract from the example utterance.
2. **stories.yml** - The file containing story data. Stories are example end-to-end conversations.
3. **rules.yml** - Rules are a type of training data used to train your assistant's dialogue management model. Rules describe short pieces of conversations that should always follow the same path.

The format can be found [here](https://rasa.com/docs/rasa/training-data-format).

**Important recap and syntax:**

1. **Intents** 
    - Intents are basically user goals (what the user wants to express)
    - **Syntax:** Intents are defined using a double hashtag. Each intent is followed by multiple examples of how a user might express that intent.
    - Each intent your assistant is capable of understanding will need to be defined in the nlu.md file.

2. **Entitites** 
    - Important keywords that the assistant should extract from the example utterance.
    - **Syntax:** They are labeled with square brackets and tagged with their type in parentheses

**Deliverables:**

1. Define who your users are
2. Understand the purpose of your chatbot
3. Document the most likely conversations that users will have with your assistant
    - Gather a comprehensive list of possible questions your bot will have to answer
        - Leverage the knowledge of domain experts
        - Look at common search queries on your website
        - Ask your customer service team about their most common requests
    - Outlne the conversation flow
4. NLU Training Data

**Basic Practices**:

1. You don’t need to write every possible utterance to train an intent, but you should provide **10-15 examples**.
2. Make sure you provide **high-quality data** to train your model. Examples should be relevant to the intents, and be sure that there’s plenty of diversity in the vocabulary you use in your examples.

--------
### **Step 4: Training the NLU Model**

**Important terms:**

1. **NLU model** 
    - An NLU model is used to extract meaning from text input. 
    - Training an NLU model on the data from the previous step allows the model to make predictions about the intents and entities in new user messages, even when the message doesn’t match any of the examples the model has seen before.

2. **Training pipeline** 
    - NLU models are created through a training pipeline, also referred to as a processing pipeline. 
    - A training pipeline is a sequence of processing steps which allow the model to learn the training data’s underlying patterns.

3. **Word embeddings** 
    - Word embeddings convert words to vectors, or dense numeric representations based on multiple dimensions. 
    - Similar words are represented by similar vectors, which allows the technique to capture their meaning. 
    - Word embeddings are used by the training pipeline components to make text data understandable to the machine learning model.

**Deliverables**:

1. Pipeline configuration
    - Rasa comes with 2 pre-configured piplines:
       
        1. Pretrained_embeddings_spacy
        2. Supervised_embeddings 

        More information about it [here](https://blog.rasa.com/the-rasa-masterclass-handbook-episode-3/).

        Note: The pretrained_embeddings_spacy pipeline is the best choice when you don’t have a lot of training data and your assistant will be fairly simple. The supervised_embeddings pipeline is the best choice when your assistant will be more complex, especially if you need to support non-English languages.
2. Model Training
    - After the data has been created from the previous step and pipeline is configured to suit your chatbot.
    - The assistant’s processing pipeline is defined in the config.yml    
    - Run the command 

            rasa train nlu
        This will train the model on your training data and save it in a directory called models.
    - Retraining with a different pipeline is just a repetition of the steps above.

3. Model Testing
    - Test the newly trained model by running the Rasa CLI command

            rasa shell nlu 
        This loads the most recently trained NLU model and allows you to test its performance by conversing with the assistant on the command line.

    - While in test mode, type a message in your terminal, for example, ‘Hello there.’ Rasa CLI outputs a JSON object containing several useful pieces of data:

        1. The intent the model thinks is the most likely match for the message.

        2. For example: {“name: greet”, “confidence: 0.95347273804”}. This means the model is 95% certain “Hello there” is a greeting.
        3. A list of extracted entities, if there are any.
        4. A list of intent_rankings. These results show the intent classification for all of the other intents defined in the training data. The intents are ranked according to the model's prediction of an intent match.


------------

That's all that's needed for the basic Rasa setup, and that's all the base you need to go on and build a great customized chatbot.

Useful resources:
1. [Installation Guide](https://rasa.com/docs/rasa/installation)
2. [Rasa Glossary](https://rasa.com/docs/rasa/glossary)
3. [CLI Cheatsheet](https://rasa.com/docs/rasa/command-line-interface)
4. [Training Data Format](https://rasa.com/docs/rasa/training-data-format)
5. [Model Configuration](https://rasa.com/docs/rasa/model-configuration)
6. [Rasa X](https://rasa.com/docs/rasa-x/) - For conversation driven development
6. [Rasa Action Server](https://rasa.com/docs/action-server) - Runs custom actions for a Rasa Open Source conversational assistant.

The masterclass provides additional customizations to various aspects of the bot, which are useful to checkout!


# coding: utf-8

# MUST pip install -U nltk
# pip install sklearn
import nltk
from nltk.corpus import stopwords
# If can't find stopwords or punkt, uncomment these.
# nltk.download('stopwords')
# nltk.download('punkt')
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
import json
import sys
import string

stop_words = set(stopwords.words('english'))
good_news_ref = open('./Python/NewsLearnReference.txt', 'r') 
news_learn_reference = good_news_ref.read()
bad_news_ref = open('./Python/BadNewsLearnReference.txt', 'r') 
bad_news_learn_reference = bad_news_ref.read()

newsString = sys.argv[1].strip("'<>() ").replace('\ufffd', '\'')
news = json.loads(newsString)

# Test file to test json data. 
# with open('C:/path/to/test/data', encoding='utf-8') as json_file:
    # news = json.load(json_file)#sys.argv[1]
	
### Pre-processing ###
for article in news['articles']:
    article['learn_content'] = article['title'] + ' ' + str(article['content']).split(' [+')[0].rsplit(' ',1)[0]
	
stemmer = nltk.stem.porter.PorterStemmer()
remove_punctuation_map = dict((ord(char), None) for char in string.punctuation)

# Stems all the tokens. 
def stem_tokens(tokens):
    return [stemmer.stem(item) for item in tokens]

# Removes stop words and punctuation then tokenizes text.
def normalize(text):
    word_tokens = nltk.word_tokenize(text.lower().translate(remove_punctuation_map))
    word_tokens = [w for w in word_tokens if not w in stop_words]
    return stem_tokens(word_tokens)

vectorizer = TfidfVectorizer(tokenizer=normalize)

def cosine_sim(text1, text2):
    tfidf = vectorizer.fit_transform([text1, text2])
    return ((tfidf * tfidf.T).A)[0,1]

good_news = {}
good_news['articles'] = []
article_num = 0

### Calculate cosine similarity ###
for article in news['articles']:
    # Cosine similarity for words we want to see.
    cosine_similarity = cosine_sim(article['learn_content'], news_learn_reference)
    # Cosine similarity for words we don't want to see.
    bad_cosine_similarity = cosine_sim(article['learn_content'], bad_news_learn_reference)
    article.pop('learn_content', None)
    # Prints every article and cosine similarities for debugging.
    # print('Article: ' + article['title'] +'\nCosine Similarity: ' + str(cosine_similarity) + '\nBad Cosine Similarity: ' + str(bad_cosine_similarity))# + '\n')
    # print(article['content'] + '\n')
    if ((cosine_similarity > 0.12) & (bad_cosine_similarity < 0.1)):
	    good_news['articles'].append(article)
	    article_num += 1
		
print(json.dumps(good_news, indent=4, sort_keys=True))

sys.stdout.flush()
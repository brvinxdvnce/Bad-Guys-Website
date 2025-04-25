import numpy as np
from tensorflow.keras.datasets import mnist
import json

class NeuralNetwork:
    def __init__(self, input_nodes, hidden_nodes, output_nodes, learning_rate):
        self.input_nodes = input_nodes
        self.hidden_nodes = hidden_nodes
        self.output_nodes = output_nodes
        self.lr = learning_rate

        # Веса между входным и скрытым слоями
        self.wih = np.random.normal(0.0, pow(self.hidden_nodes, -0.5), (self.input_nodes, self.hidden_nodes))

        # Веса между скрытым и выходным слоями
        self.who = np.random.normal(0.0, pow(self.output_nodes, -0.5), (self.hidden_nodes, self.output_nodes))

        # Смещения для скрытого слоя
        self.bh = np.zeros(self.hidden_nodes)

        # Смещения для выходного слоя
        self.bo = np.zeros(self.output_nodes)

        # Функция активации (сигмоида)
        self.activation_function = lambda x: 1.0 / (1.0 + np.exp(-x))

    def train(self, inputs_list, targets_list):
        # Преобразуем список входов и меток в двумерные массивы
        inputs = np.array(inputs_list, ndmin=2) #(784,1)
        targets = np.array(targets_list, ndmin=2)

        # Вычисление входных значений
        hidden_inputs = np.dot(inputs, self.wih) + self.bh  # Скрытый слой
        hidden_outputs = self.activation_function(hidden_inputs) #Скрытый слой с учетом активации

        final_inputs = np.dot(hidden_outputs, self.who) + self.bo  # Выходной слой
        final_outputs = self.activation_function(final_inputs) # Выходной слой с учетом активации

        # Вычисление ошибка
        output_errors = targets - final_outputs # выходной слой
        hidden_errors = np.dot(output_errors, self.who.T) # средний слой

        # ОБНОВЛЕНИЕ ВЕСОВ И СМЕЩЕНИЙ
        # Обновление весов между скрытым и выходным слоями
        self.who += self.lr * np.dot(hidden_outputs.T, (output_errors * final_outputs * (1.0 - final_outputs)))

        # Обновление весов между входом и скрытым слоем
        self.wih += self.lr * np.dot(inputs.T, (hidden_errors * hidden_outputs * (1.0 - hidden_outputs)))

        # Обновление bias для выходного слоя
        self.bo += self.lr * np.sum(output_errors * final_outputs * (1.0 - final_outputs), axis=0)

        # Обновление bias для скрытого слоя
        self.bh += self.lr * np.sum(hidden_errors * hidden_outputs * (1.0 - hidden_outputs), axis=0)


#    X_train: (60000, 28, 28), y_train: (60000,)
#    X_test:  (10000, 28, 28), y_test:  (10000,)
(X_train, y_train), (X_test, y_test) = mnist.load_data()


X_train = (X_train / 255.0)
X_test  = (X_test  / 255.0)


X_train = X_train.reshape(X_train.shape[0], -1)
X_test  = X_test.reshape(X_test.shape[0],  -1)


# Метки в векторы длины 10

num= 10

def one_hot_encode(labels, num_classes=10):
    result = np.zeros((labels.size, num_classes))
    for idx, val in enumerate(labels):
        result[idx, val] = 1
    return result

y_train_onehot = one_hot_encode(y_train, num)
y_test_onehot  = one_hot_encode(y_test, num)


# Обучение сети
input_nodes  = 784
hidden_nodes = 200
output_nodes = 10
learning_rate = 0.1
nn = NeuralNetwork(input_nodes, hidden_nodes, output_nodes, learning_rate)

count_learn = 5  # число проходов по всем данным
for e in range(count_learn):
    for i in range(X_train.shape[0]):
        nn.train(X_train[i], y_train_onehot[i])
    print("good")



wih_list = nn.wih.tolist()
who_list = nn.who.tolist()
bh_list = nn.bh.tolist()
bo_list = nn.bo.tolist()

with open('input_x_hidden_weights.json', 'w') as f:
    json.dump(wih_list, f)

with open('hidden_x_output_weights.json', 'w') as f:
    json.dump(who_list, f)

with open('hidden_biases.json', 'w') as f:
    json.dump(bh_list, f)

with open('output_biases.json', 'w') as f:
    json.dump(bo_list, f)



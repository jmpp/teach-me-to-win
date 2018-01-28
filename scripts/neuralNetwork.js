(function(neuralNetwork) {
    'use strict';

    function Perceptron(input, hidden, output)
    {
        // create the layers
        var inputLayer = new synaptic.Layer(input);
        var hiddenLayer = new synaptic.Layer(hidden);
        var outputLayer = new synaptic.Layer(output);

        // connect the layers
        inputLayer.project(hiddenLayer);
        hiddenLayer.project(outputLayer);

        // set the layers
        this.set({
            input: inputLayer,
            hidden: [hiddenLayer],
            output: outputLayer
        });
    }

    // extend the prototype chain
    Perceptron.prototype = new synaptic.Network();
    Perceptron.prototype.constructor = Perceptron;

    var myPerceptron = new Perceptron(1,1,1);
    var myTrainer = new synaptic.Trainer(myPerceptron);

    const trainingSet = [
        {
            input: [1],
            output: [1] // UP
        },
        {
            input: [3],
            output: [3] // DOWN
        },
        {
            input: [0],
            output: [0] // LEFT
        },
        {
            input: [2],
            output: [2] // RIGHT
        }
    ];

    const trainerResults = myTrainer.train(trainingSet, {
        rate      : 0.4,
        iterations: 1000,
        error     : 0.0005,
        log       : 100,
        // cost      : synaptic.Trainer.cost.CROSS_ENTROPY,
        schedule : {
            every: 1,
            do: function() {
                console.log('training...')
            }
        }
    });

    myPerceptron.activate([0]);

    

    

    console.info('Trainer just finished with this result :');
    console.log(trainerResults);

    console.log(myPerceptron)

    window.neuralNetwork = myPerceptron;

})(window.neuralNetwork);
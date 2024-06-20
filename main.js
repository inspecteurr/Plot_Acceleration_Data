
// Select the elements 
const fileInput = document.getElementById('fileInput');
const Y_ctx = document.getElementById('Y_Data_Canva').getContext('2d');
const Y_Graph_X_Scale = document.getElementById('Y_Graph_X_Scale');

const Z_ctx = document.getElementById('Z_Data_Canva').getContext('2d');
const Z_Graph_X_Scale = document.getElementById('Z_Graph_X_Scale');

var Y0_position =0;
var Y0_speed =0;
var Y2_position =0;
var Y2_speed =0;


// See the event if a file is load
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const content = event.target.result;
            const parts = content.split(',');
            var Values = [];


            ///////////// Formatting data ///////////////
            parts.forEach(element => {
                const parties = element.split("\r\n");
                parties.forEach(partie => Values.push(partie));
            });

            var a_0_y = [];
            var a_0_z = [];
            var a_1_z = [];
            var a_2_y = [];
            var a_2_z = [];
            for (let i = 5; i < Values.length - 4; i += 5) {
                a_0_y.push(parseFloat(Values[i]));
            }
            for (let i = 6; i < Values.length - 4; i += 5) {
                a_0_z.push(parseFloat(Values[i]));
            }
            for (let i = 7; i < Values.length - 4; i += 5) {
                a_1_z.push(parseFloat(Values[i]));
            }
            for (let i = 8; i < Values.length - 4; i += 5) {
                a_2_y.push(parseFloat(Values[i]));
            }
            for (let i = 9; i < Values.length - 4; i += 5) {
                a_2_z.push(parseFloat(Values[i]));
            }

            /////////////////////////////////////////////////////////

            // Create the time data 
            const Y_time = [0.1];
            for (let i = 0; i < a_0_y.length - 1; i++) {
                Y_time.push(Y_time[i] + 0.1);
            }

            const Z_time = [0.1];
            for (let i = 0; i < a_0_y.length - 1; i++) {
                Z_time.push(Z_time[i] + 0.1);
            }
            ///////////////////////////////////////   

            /////// Create datas to give to the Graph //////////////
            const Y_data = {
                labels: [Y_time[0]],
                datasets: [{
                    label: 'a_0_y',
                    data: [a_0_y[0]],
                    fill: false,
                    borderColor: '#e60f0f',
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    label: 'a_2_y',
                    data: [a_2_y[0]],
                    fill: false,
                    borderColor: '#780707',
                    tension: 0.1,
                    pointRadius: 0
                }
                ]
            };

            const Z_data = {
                labels: [Z_time[0]],
                datasets: [{
                    label: 'a_0_z',
                    data: [a_0_z[0]],
                    fill: false,
                    borderColor: '#5016f0',
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    label: 'a_1_z',
                    data: [a_1_z[0]],
                    fill: false,
                    borderColor: '#3309a6',
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    label: 'a_2_z',
                    data: [a_2_z[0]],
                    fill: false,
                    borderColor: '#1a0357',
                    tension: 0.1,
                    pointRadius: 0
                }
                ]
            };
            /////////////////////////////////////////

            /////// Create the options to give to the Graph /////////////////
            const Y_options = {
                animation: {
                    duration: 0
                }
            };

            const Z_options = {
                animation: {
                    duration: 0
                }
            };
            /////////////////////////////////////////////////////////////

            /////////////////// Create the Graphe ////////////////////
            const Y_Graphique = new Chart(Y_ctx, {
                type: 'line',
                data: Y_data,
                options: Y_options
            });

            const Z_Graphique = new Chart(Z_ctx, {
                type: 'line',
                data: Z_data,
                options: Z_options
            });
            ////////////////////////////////////////////////////////

            ///// New array to do like if we take data every 0.1s
            Graph_a_0_y = [a_0_y[0]];
            Graph_a_2_y = [a_2_y[0]];
            Graph_Y_time = [Y_time[0].toFixed(2)];

            Graph_a_0_z = [a_0_z[0]];
            Graph_a_1_z = [a_1_z[0]];
            Graph_a_2_z = [a_2_z[0]];
            Graph_Z_time = [Z_time[0].toFixed(2)];

            function calculerPosition(accelerations, intervalleTemps, position, speed) {
        
                for (let i = 0; i < accelerations.length; i++) {
                    const speedFinale = speed + accelerations[i] * intervalleTemps;
                    const speedMoyenne = (speed + speedFinale) / 2;
                    const deplacement = speedMoyenne * intervalleTemps;
                    position += deplacement;
                    speed = speedFinale;
                }
            
                return [position,speed];
            }


            /////////////// Update the Graph //////////////////
            function Update_Y_Graph() {

                const Line_1 = Y_Graphique.isDatasetVisible(0);
                const Line_2 = Y_Graphique.isDatasetVisible(1);

                // Take the value (unit : seconde)
                const X_Value = Y_Graph_X_Scale.value;

                // Take the new data 
                for (let i = 0; i < 10; i++) {
                    Graph_a_0_y.push(a_0_y[i]);
                    Graph_a_2_y.push(a_2_y[i]);
                    Graph_Y_time.push(Y_time[i].toFixed(2));
                    a_0_y.shift();
                    a_2_y.shift();
                    Y_time.shift();
                }

                while (Graph_a_0_y.length > (X_Value * 10)) {
                    Graph_a_0_y.shift();
                    Graph_a_2_y.shift();
                    Graph_Y_time.shift();
                }

                const data = {
                    labels: Graph_Y_time,
                    datasets: [{
                        label: 'a_0_y',
                        data: Graph_a_0_y,
                        fill: false,
                        borderColor: '#e60f0f',
                        tension: 0.1,
                        pointRadius: 0
                    },
                    {
                        label: 'a_2_y',
                        data: Graph_a_2_y,
                        fill: false,
                        borderColor: '#780707',
                        tension: 0.1,
                        pointRadius: 0
                    }]
                };

                Y_Graphique.data = data;
                Y_Graphique.update();
                if (Line_1 == false) {
                    Y_Graphique.hide(0);
                }
                if (Line_2 == false) {
                    Y_Graphique.hide(1);
                }

                [Y0_position, Y0_speed] = calculerPosition(Graph_a_0_y,0.1,Y0_position,Y0_speed);
                [Y2_position, Y2_speed] = calculerPosition(Graph_a_2_y,0.1,Y2_position,Y2_speed);
                console.log("Y0 speed = "+Y0_speed);
                console.log("Y2 speed = "+Y2_speed);

            }

            function Update_Z_Graph() {

                const Line_1 = Z_Graphique.isDatasetVisible(0);
                const Line_2 = Z_Graphique.isDatasetVisible(1);

                // Take the value (unit : seconde)
                const X_Value = Z_Graph_X_Scale.value;

                // Take the new data 
                for (let i = 0; i < 10; i++) {
                    Graph_a_0_z.push(a_0_z[i]);
                    Graph_a_1_z.push(a_1_z[i]);
                    Graph_a_2_z.push(a_2_z[i]);
                    Graph_Z_time.push(Z_time[i].toFixed(2));
                    a_0_z.shift();
                    a_1_z.shift();
                    a_2_z.shift();
                    Z_time.shift();
                }

                while (Graph_a_0_z.length > (X_Value * 10)) {
                    Graph_a_0_z.shift();
                    Graph_a_1_z.shift();
                    Graph_a_2_z.shift();
                    Graph_Z_time.shift();
                }

                const data = {
                    labels: Graph_Z_time,
                    datasets: [{
                        label: 'a_0_z',
                        data: Graph_a_0_z,
                        fill: false,
                        borderColor: '#5016f0',
                        tension: 0.1,
                        pointRadius: 0
                    },
                    {
                        label: 'a_1_z',
                        data: Graph_a_1_z,
                        fill: false,
                        borderColor: '#3309a6',
                        tension: 0.1,
                        pointRadius: 0
                    },
                    {
                        label: 'a_2_z',
                        data: Graph_a_2_z,
                        fill: false,
                        borderColor: '#1a0357',
                        tension: 0.1,
                        pointRadius: 0
                    }]
                };

                Z_Graphique.data = data;
                Z_Graphique.update();
                if (Line_1 == false) {
                    Z_Graphique.hide(0);
                }
                if (Line_2 == false) {
                    Z_Graphique.hide(1);
                }

            }

            // Update the graph every 0.1s
            setInterval(Update_Y_Graph, 1000);
            setInterval(Update_Z_Graph, 1000);

            

        };

        // Read the file as a text file
        reader.readAsText(file);
    }
});
////////////////////////////////////



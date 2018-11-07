/*
 * Copyright 2016 e-UCM (http://www.e-ucm.es/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * This project has received funding from the European Union’s Horizon
 * 2020 research and innovation programme under grant agreement No 644187.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0 (link is external)
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * This file issues the needed requests to set up the kibana application
 * with the roles defined in the 'kibana-routes.js' file.
 *
 */

var Path = require('path');
var request = require('request');
var appData = require(Path.resolve(__dirname, './kibana-routes.js')).app;

var baseUsersAPI = process.env.A2_API_PATH;
request.post(baseUsersAPI + 'login', {
        headers: {
            Accept: 'application/json'
        },
        form: {
            username: process.env.KIBANA_A2ADMINUSERNAME || 'root',
            password: process.env.KIBANA_A2ADMINPASSWORD || 'root'
        },
        json: true
    },
    function (err, httpResponse, body) {
        if (err) {
            console.error(err);
            if (err.errno && err.errno.indexOf('ECONNREFUSED') > -1) {
                console.error('Could not connect to A2 to login!');
                return process.exit(-1);
            }
            console.log('Did not register kibana with A2, continuing anyway!');
            return process.exit(0);
        }

        appData.name = 'Kibana';
        appData.prefix =  'kibana';
        appData.host = process.env.MY_HOST;

        request({
            uri: baseUsersAPI + 'applications/prefix/' + appData.prefix,
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + body.user.token,
                Accept: 'application/json'
            }
        }, function (err, httpResponse, response) {
            if (!err) {
                appData.look = JSON.parse(response).look;
            }

            request({
                uri: baseUsersAPI + 'applications',
                method: 'POST',
                body: appData,
                json: true,
                headers: {
                    Authorization: 'Bearer ' + body.user.token,
                    Accept: 'application/json'
                }
            }, function (err, httpResponse, body) {
                if (err) {
                    console.error(err);
                    if (err.errno && err.errno.indexOf('ECONNREFUSED') > -1) {
                        console.error('Could not connect to A2 to register the kibana application!');
                        return process.exit(-1);
                    }
                    console.log('Did not register the backend with A2, continuing anyway!');
                    return process.exit(0);
                }

                if (body.message) {
                    console.error('Error', body.message,
                        'Did not register the backend with A2, continuing anyway!');
                } else {
                    console.log('Application and roles setup complete.');
                }

                process.exit(0);
            });

        });


    });




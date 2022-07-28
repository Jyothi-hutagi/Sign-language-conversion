import React, {useRef, useState, useEffect} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';
import {drawHand} from '../components/handposeutil';
import * as fp from 'fingerpose';
import Handsigns from '../handsigns';
import Speech from 'speak-tts'


import {
    Text,
    Heading,
    Button,
    Stack,
    Container,
    Box,
    VStack,
    ChakraProvider
} from '@chakra-ui/react'

import {Signimage, Signpass} from '../handimage';



import '../styles/App.css'

import '@tensorflow/tfjs-backend-webgl';

import {RiCameraFill, RiCameraOffFill} from "react-icons/ri";

export default function App() {
   
    const speech = new Speech() // will throw an exception if not browser supported

    const sign_text = {
        'A': 'Unity is Strength',
        'B': 'Hi Im Fine',
        'D': 'Had Your Dinner',
        'F': 'You Are Looking Great',
        'I': 'I want to get Refreshed',
        'L': 'I Like You',
        'V' : 'Victory',
        'Y': 'Life is Beautiful'
    }
    
    if(speech.hasBrowserSupport()) { // returns a boolean
        console.log("speech synthesis supported")
    }
    speech.init().then((data) => {
        // The "data" object contains the list of available voices and the voice synthesis params
        console.log("Speech is ready, voices are available", data)
    }).catch(e => {
        console.error("An error occured while initializing : ", e)
    })

        
    const [value, setValue] = useState('');
    let is_speaking ;
   
    
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const [camState,
        setCamState] = useState("on");

    const [sign, setSign] = useState(null);

    const [signtext, setSignText] = useState(null);


    let signList = [];
    let currentSign = 0;

    let gamestate = 'started';

    // let net;

    async function runHandpose() {
        const net = await handpose.load();
              setInterval(() => {
            detect(net);
        }, 500);
    };


    function _signList(){
        signList = generateSigns();
    }


    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function generateSigns(){
        const password = shuffle(Signpass);
        return password;
    }


    
    
    let old_value = "";
    async function detect(net) {
        // Check data is available
        if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Make Detections
            const hand = await net.estimateHands(video);

            if (hand.length > 0) {
                //loading the fingerpose model
                const GE = new fp.GestureEstimator([
                    fp.Gestures.ThumbsUpGesture,
                    Handsigns.aSign, 
                    Handsigns.bSign, 
                   // Handsigns.cSign, 
                    Handsigns.dSign, 
                   // Handsigns.eSign, 
                    Handsigns.fSign, 
                   // Handsigns.gSign,
                   // Handsigns.hSign, 
                    Handsigns.iSign, 
                  //  Handsigns.jSign, 
                  //  Handsigns.kSign, 
                    Handsigns.lSign, 
                   // Handsigns.mSign, 
                   // Handsigns.nSign,
                   // Handsigns.oSign, 
                   // Handsigns.pSign, 
                  //  Handsigns.qSign, 
                  //  Handsigns.rSign, 
                   // Handsigns.sSign, 
                   // Handsigns.tSign, 
                   // Handsigns.uSign,
                    Handsigns.vSign, 
                   // Handsigns.wSign, 
                   // Handsigns.xSign, 
                    Handsigns.ySign, 
                  //  Handsigns.zSign
                ]);

                const estimatedGestures = await GE.estimate(hand[0].landmarks, 6.5);
                // document.querySelector('.pose-data').innerHTML =JSON.stringify(estimatedGestures.poseData, null, 2);


                if (gamestate === 'started') {
                    document
                        .querySelector('#app-title')
                        .innerText = "Make a 👍 gesture with your hand to start";
                }

                if (estimatedGestures.gestures !== undefined && estimatedGestures.gestures.length > 0) {
                    const confidence = estimatedGestures
                        .gestures
                        .map((p) => p.confidence);
                    const maxConfidence = confidence.indexOf(Math.max.apply(undefined, confidence));

                    console.log("MY name : "+estimatedGestures.gestures[maxConfidence].name);

                    if(estimatedGestures.gestures[maxConfidence].name=="B" && old_value!="B"){
                        console.log("camee  in B ");
                       
                        speech.speak({
                                text: 'Hi Im Fine',
                            }).then(() => {
                                console.log("Success Voice for B Done !")
                            }).catch(e => {
                                console.error("An error occurred :", e)
                            })
                        
                      
                        old_value = estimatedGestures.gestures[maxConfidence].name;
                    }else if(estimatedGestures.gestures[maxConfidence].name=="D" && old_value!="D"){
                        console.log("camee  in D ");
                       
                        speech.speak({
                                text: 'Had Your Dinner',
                            }).then(() => {
                                console.log("Success Voice for D Done !")
                            }).catch(e => {
                                console.error("An error occurred :", e)
                            })
                        
                      
                        old_value = estimatedGestures.gestures[maxConfidence].name;
                    }else if(estimatedGestures.gestures[maxConfidence].name=="L" && old_value!="L"){
                        console.log("camee  in L ");
                       
                        speech.speak({
                                text: 'I Like You',
                            }).then(() => {
                                console.log("Success Voice for D Done !")
                            }).catch(e => {
                                console.error("An error occurred :", e)
                            })
                        
                      
                        old_value = estimatedGestures.gestures[maxConfidence].name;
                    }else if(estimatedGestures.gestures[maxConfidence].name=="I" && old_value!="I"){
                        console.log("camee  in I ");
                       
                        speech.speak({
                                text: 'I want to get Refreshed',
                            }).then(() => {
                                console.log("Success Voice for I Done !")
                            }).catch(e => {
                                console.error("An error occurred :", e)
                            })
                        
                      
                        old_value = estimatedGestures.gestures[maxConfidence].name;
                    }else if(estimatedGestures.gestures[maxConfidence].name=="Y" && old_value!="Y"){
                        console.log("camee  in Y ");
                       
                        speech.speak({
                                text: 'Life is Beautiful',
                            }).then(() => {
                                console.log("Success Voice for Y Done !")
                            }).catch(e => {
                                console.error("An error occurred :", e)
                            })
                        
                      
                        old_value = estimatedGestures.gestures[maxConfidence].name;
                    }else if(estimatedGestures.gestures[maxConfidence].name=="A" && old_value!="A"){
                        console.log("camee  in A ");
                       
                        speech.speak({
                                text: 'Unity is Strength',
                            }).then(() => {
                                console.log("Success Voice for A Done !")
                            }).catch(e => {
                                console.error("An error occurred :", e)
                            })
                        
                      
                        old_value = estimatedGestures.gestures[maxConfidence].name;
                    }else if(estimatedGestures.gestures[maxConfidence].name=="F" && old_value!="F"){
                        console.log("camee  in F ");
                       
                        speech.speak({
                                text: 'You Are Looking Great',
                            }).then(() => {
                                console.log("Success Voice for A Done !")
                            }).catch(e => {
                                console.error("An error occurred :", e)
                            })
                        
                      
                        old_value = estimatedGestures.gestures[maxConfidence].name;
                    }else if(estimatedGestures.gestures[maxConfidence].name=="V" && old_value!="V"){
                        console.log("camee  in V");
                       
                        speech.speak({
                                text: 'Victory',
                            }).then(() => {
                                console.log("Success Voice for A Done !")
                            }).catch(e => {
                                console.error("An error occurred :", e)
                            })
                        
                      
                        old_value = estimatedGestures.gestures[maxConfidence].name;
                    }

                    
                    console.log("Oldvalue is : "+old_value);
                    
                    setSign(estimatedGestures.gestures[maxConfidence].name);
                    setSignText(sign_text[estimatedGestures.gestures[maxConfidence].name]);
                    //setting up game state, looking for thumb emoji
                    if (estimatedGestures.gestures[maxConfidence].name === 'thumbs_up' && gamestate !== 'played') {
                      
                        gamestate = 'played';
                       
                    } else if (gamestate === 'played') {
                        document
                            .querySelector('#app-title')
                            .innerText = "";

                       

                        //game play state
                        
                        
                    } else if (gamestate === 'finished') {
                        return;
                    }
                }

            }
            // Draw hand lines
            const ctx = canvasRef.current.getContext("2d");
            drawHand(hand, ctx);
        }
    };

    useEffect(() => {
        runHandpose();
    },[]);

    function turnOffCamera() {
        if (camState === "on") {
            setCamState('off');
        } else {
            setCamState('on');
        }
    }
    

    return (
        <ChakraProvider>
           
            <Box bgColor="#5784BA">
            <Container centerContent maxW="xl" height="100vh" pt="0" pb="0">
                <VStack spacing={4} align="center">
                    <Box h="20px"></Box>
                    <Heading as="h3" size="md" className="tutor-text" color="white" textAlign="center"></Heading>
                    <Box h="20px"></Box>
                </VStack>

                <Heading as="h1" size="lg" id="app-title" color="white" textAlign="center">Loading The Model</Heading>

                <Box id="webcam-container">
                    {camState === 'on'
                        ? <Webcam id="webcam" ref={webcamRef}/>
                        : <div id="webcam" background="black"></div>}

                    {sign 
                        ? (<div style={{
                            position: "absolute",
                            marginLeft: "auto",
                            marginRight: "auto",
                            right: "calc(50% - 50px)",
                            bottom: 100,
                            textAlign: "-webkit-center",}}>
                            <Text color="white" fontSize="sm" mb={1}>detected gestures</Text>
                            <span id="node"></span>
                            <p>{signtext}</p>
                        <img alt="signImage"
                            src={Signimage[sign]}
                            style={{
                            height: 30
                        }}/>
                         
                        </div>
                       
                        
                        )
                        : (" ")}
                </Box>

                <canvas id="gesture-canvas" ref={canvasRef} style={{}}/>

                <Box
                    id="singmoji"
                    style={{
                    zIndex: 9,
                    position: 'fixed',
                    top: '50px',
                    right: '30px'
                }}></Box>

               
{/* <pre className="pose-data" color="white" style={{position: 'fixed', top: '150px', left: '10px'}} >Pose data</pre> */}

            </Container>

            <Stack id="start-button" spacing={4} direction="row" align="center">
                <Button leftIcon={camState === 'on'
                            ? <RiCameraFill size={20}/>
                            : <RiCameraOffFill size={20}/>} onClick={turnOffCamera} colorScheme="orange">Camera</Button>
                
            </Stack>
            </Box>
        </ChakraProvider>
    )
}



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import {FormControl, FormGroup, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  constructor(private router: Router, private http:HttpClient) { }
  questions:any = [];
  minutes:number = 0;
  seconds:number = 0;
  countDownDate:number = 0;

  goto_quiz() {
    // this.router.navigate(['./quiz']);

  }
  goto_quiz_result() {
    this.router.navigate(['./quiz-result']);
  }
  ngOnInit() {
    let noOfQuizs = parseInt(sessionStorage.getItem("TestDuration"));
    // let candidateID = JSON.parse(sessionStorage.getItem("candidateData"))._id;
    this.http.post('http://localhost:4000/quizRoute/getExamQuestions', {size: noOfQuizs} ).subscribe((resp:any) => {
      if(resp && resp.quizs)
        this.questions = resp.quizs;
      if(this.questions.length === 15)
        this.countDownDate = (new Date().getTime()) + (1000*60*30)
      if(this.questions.length === 25)
        this.countDownDate = (new Date().getTime()) + (1000*60*45)
      if(this.questions.length === 30)
        this.countDownDate = (new Date().getTime()) + (1000*60*60)
      // Update the count down every 1 second
      var  interval = setInterval(() => {

          // Get todays date and time
          let now = new Date().getTime();

          // Find the distance between now and the count down date
          let distance = this.countDownDate - now;
          
          // Time calculations for minutes and seconds
          // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

          console.log( this.minutes+ "minutes ", this.seconds+"second(s)");

          // If the count down is finished, write some text 
          if (distance < 0) {
            clearInterval(interval);
            alert("Time over");
          }
        }, 1000);
    });
  }


  convertOtionsToJson(option){
    option = option.replace(/'/g, '"');
    option = option.replace(/([^"]+)|("[^"]+")/g, function($0, $1, $2) {
      if ($1) {
          return $1.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
      } else {
          return $2; 
      } 
    });
    return JSON.parse(option);
  }

}
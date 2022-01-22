import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-business-info',
  templateUrl: './view-business-info.component.html',
  styleUrls: ['./view-business-info.component.scss'],
})
export class ViewBusinessInfoComponent implements OnInit {
  businessObj = {
    business_id: 1,
    business_name: 'Rythm',
    links: [
      {
        link_id: 1,
        url: 'instagram.com/tinywhales/?hl=en',
        title: 'Instagram',
      },
    ],
    recognitions: [
      {
        recognition_id: 4,
        recognition_name: 'MNET ASIAN MUSIC AWARDS 2018 MAMA',
        recognition_type: 'AWARD',
        photo_url:
          'https://www.figma.com/file/cpthPodXeElBUFKRwfxKtq/Tinywhale---For-Developers?node-id=836%3A1288',
      },
      {
        recognition_id: 5,
        recognition_name: 'RCM Piano Teacher Certificate',
        recognition_type: 'CERTIFICATE',
        photo_url:
          'https://www.figma.com/file/cpthPodXeElBUFKRwfxKtq/Tinywhale---For-Developers?node-id=836%3A1288',
      },
    ],
    testimonials: [
      {
        testimonial_id: 6,
        photo_url:
          'https://www.figma.com/file/cpthPodXeElBUFKRwfxKtq/Tinywhale---For-Developers?node-id=836%3A1300',
        name: 'Druv Rai',
        title: 'VP Google.com',
        testimonial:
          'Deepanita is very committed towards what she does and it shows through her love for music. Her patience and jovial nature makes the learning process a successful and memorable journey.',
        rating: 5,
      },
      {
        testimonial_id: 7,
        photo_url:
          'https://www.figma.com/file/cpthPodXeElBUFKRwfxKtq/Tinywhale---For-Developers?node-id=836%3A1300',
        name: 'Druv Rai',
        title: 'VP Google.com',
        testimonial:
          'Deepanita is very committed towards what she does and it shows through her love for music. Her patience and jovial nature makes the learning process a successful and memorable journey.',
        rating: 5,
      },
    ],
    business_photos: [
      {
        photo_id: 2,
        photo_url:
          'https://www.figma.com/file/cpthPodXeElBUFKRwfxKtq/Tinywhale---For-Developers?node-id=836%3A1282',
      },
      {
        photo_id: 3,
        photo_url:
          'https://www.figma.com/file/cpthPodXeElBUFKRwfxKtq/Tinywhale---For-Developers?node-id=836%3A1283',
      },
    ],
    store: {
      store_id: 8,
      company_name: 'Rythm',
      about_me: `I'm a professional singer/songwriter/multi instrumentalist based in Delhi. I have been into music for the past 16 years.I have done my bachelors in hindustani vocals from Prayag university. In 2018, I represented India in 67th international music festival and proudly won the 2nd position for the country.
      I teach Piano, Keyboard, Indian and western vocals. Age- no bar.`,
      punchline: ' # Learning Piano Simplified - The fas-track to learn piano like a pro !',
    },
  };
  constructor() {}

  ngOnInit(): void {}
}

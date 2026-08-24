# Scenic City Learning

Website and Facebook Page kit for **Scenic City Learning** — Amanda “Mandi” Thurmond’s K–5 learning-coach practice in Red Bank / greater Chattanooga.

**Site:** [https://sceniccitylearning.com](https://sceniccitylearning.com)  
**Redirect:** [https://chattanoogalearning.com](https://chattanoogalearning.com) → sceniccitylearning.com  
**GitHub Pages source:** [https://daviswright-hash.github.io/mandi-learning-coach/](https://daviswright-hash.github.io/mandi-learning-coach/)

## Open the site locally

Double-click `START-SITE.bat`, or from this folder:

```
python -m http.server 8787
```

Then visit http://localhost:8787

## What’s included

- `index.html` — public website (services, about, $40/hour, booking form)
- `facebook/index.html` — copy-paste kit to create the Facebook Page
- `facebook/profile-photo.jpg` and `facebook/cover-photo.jpg` — ready to upload
- Brand assets in `assets/`

## Point the domain (Porkbun)

Both domains are registered. DNS:

1. **sceniccitylearning.com:** delete `pixie.porkbun.com` records. Four A records on `@` (`185.199.108.153`–`111.153`) and `www` CNAME to `daviswright-hash.github.io`.
2. Repo `CNAME` file is `sceniccitylearning.com`.
3. **chattanoogalearning.com:** Porkbun URL Forward, 301 to `https://sceniccitylearning.com`.

## Facebook Page

Facebook requires Mandi to create the Page while signed in. Open `facebook/index.html` and use **Create the Facebook Page**. Every field, bio, and the first five posts are ready to copy.

Suggested Page name: **Scenic City Learning**  
Suggested username: **ScenicCityLearning**  
Website field: **https://sceniccitylearning.com**

## Contact

- Website: https://sceniccitylearning.com
- Email: orangemandimack@yahoo.com
- Phone: (929) 256-3772 (Google Voice)
- Rate: $40/hour
- Grades: K–5
- Area: Sessions at Mandi’s home in Red Bank (street address is not on the site; shared when families book)

## After the Facebook Page exists

Replace the “Facebook page kit” footer link on the website with the live Page URL (for example `https://www.facebook.com/ScenicCityLearning`).

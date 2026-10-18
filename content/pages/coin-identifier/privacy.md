---
type: Page
title: Coin Identifier Privacy Policy
sections:
  - type: PrivacySection
    title: Coin Identifier Privacy Policy
    lastUpdated: October 18, 2026
    content: >
      This policy describes how BG Mobile Dev ("we", "us", or "our") handles
      information in **Coin Identifier** for iPhone and iPad (bundle
      identifier `tr.com.bgmobiledev.coinidentifier`, the "App"). It is
      specific to Coin Identifier, it is effective from October 18, 2026, and,
      for this App, it replaces our [general privacy policy](/privacy-policy).


      ## The short version


      - There is **no account**. No sign-up, no login, no e-mail address, no
      password — none exists anywhere in the App.

      - We run **no user database**. No server of ours holds your coins,
      photos, collections or history.

      - Your scan history, coin photos and collections live **on your
      device**.

      - When you identify a coin, its photo is sent through our server to a
      third-party AI model, **OpenAI**, so the coin can be identified; the
      same happens to any follow-up question you type. The App tells you this
      and asks you to continue before your first identification. We do not
      keep the photo or the question on our server.

      - There is **no analytics SDK, no advertising and no tracking**. The App
      does not use the advertising identifier, so it never shows an App
      Tracking Transparency prompt.


      ## No account, no user database


      Coin Identifier has no registration of any kind. We never ask for your
      name, e-mail address, phone number, postal address or a password, and we
      have no way to associate the App's data with your identity. Because there
      is no account, there is also no server-side profile to breach, sell or
      hand over.


      ## What stays on your device


      The following is created and kept locally in the App's own storage on
      your device:


      - Your scan history: the coin photos you took or picked, and the
      identification results

      - Your collections, including any purchase prices, purchase dates and
      notes you enter

      - Your settings, whether you have completed onboarding, whether you have
      accepted the AI processing notice, and a few values the App uses to
      decide when to ask for a rating


      The text of follow-up conversations is not stored by the App. We do not
      receive a copy of any of the data above. You can delete history entries
      and collections inside the App, and deleting the App removes this local
      data.


      A little information is kept in your device's **Keychain**, which iOS
      may keep after the App is deleted:


      - **How many free identifications remain.** This is a single number —
      no photo, no result, no personal information — and it is kept so that
      reinstalling does not reset the free tier.

      - **The identifier of the App's App Attest key** and whether it has been
      registered, which lets the App prove to our server that it is a genuine
      copy (see below). After a reinstall a new key is created and the old one
      is no longer used.


      ## How identification works


      When you identify a coin, the App resizes and compresses the photo of
      the front (and, if you add it, the back) and sends it in a single
      request to our AI proxy server, which forwards it to **OpenAI's** model
      to recognise the coin and estimate its details. Specifically:


      - Before the first identification on an install, the App shows a notice
      that your photos and follow-up questions are sent to OpenAI through our
      server, and you choose Continue or Cancel.

      - The request is authenticated with Apple's **App Attest**, so that only
      genuine copies of the App can use the server. It carries **no name, no
      e-mail address and no account**.

      - Our server forwards only the content of the request to OpenAI. OpenAI
      does not receive your network address or the App Attest key.

      - For each attested copy of the App, our server keeps a record of its
      App Attest key (the key identifier and public key, the app it belongs
      to, a signature counter, and when it was registered and last used) and
      a **monthly request counter**. The counter enforces the App's monthly
      limit of identifications and questions per device and protects the
      service from abuse.

      - **We store no photos and no question text.** The request passes
      through our server and is not kept there.

      - Under OpenAI's API terms, data sent through the API is not used to
      train OpenAI's models, and a request **may be retained by OpenAI for up
      to 30 days for abuse monitoring, then deleted**. That retention is
      OpenAI's, not ours, and is governed by OpenAI's own terms and
      [privacy policy](https://openai.com/policies/privacy-policy).


      **Follow-up questions.** When you ask a question about a result, the App
      sends your question as text, together with a text summary of the
      identified coin and the earlier messages of that conversation, the same
      way. The photo is not sent again.


      You can stop sharing at any time simply by not identifying coins or
      asking questions; the notice is shown again if you reinstall the App.
      Photos and questions that were already sent cannot be recalled from
      OpenAI's abuse-monitoring retention described above.


      Coin values, grades and error checks shown in the App are AI estimates,
      not professional appraisals. Silver melt values are calculated on your
      device from a fixed reference silver price shown in the App.


      **Exporting a collection.** If you export a collection as a CSV file,
      the file is created on your device and goes only where you choose to
      share it.


      ## Analytics and advertising


      Coin Identifier contains **no third-party analytics, crash-reporting or
      attribution SDK** and **no advertising**. We do not use the advertising
      identifier (IDFA), and we do not track you across apps or websites. If
      you have chosen in iOS Settings to share analytics with app developers,
      Apple may give us crash reports and aggregated usage statistics, which
      do not identify you.


      ## Purchases and subscriptions


      Purchases are processed entirely by **Apple's App Store**. We never see
      or receive your payment card, billing address or Apple Account
      credentials. The App reads your entitlement locally from StoreKit on your
      device to decide whether your subscription is active.


      Apple also sends us **App Store Server Notifications** about subscription
      events for this App — a purchase, a renewal, a cancellation, a refund.
      Those messages identify a transaction, not a person: they carry no name,
      no e-mail address and no postal address. We do not keep them beyond
      short-lived server logs.


      Subscriptions are governed by Apple's
      [standard Terms of Use (EULA)](https://www.apple.com/legal/internet-services/itunes/dev/stdeula/).
      You can manage or cancel a subscription in your Apple Account settings;
      deleting the App does not cancel a subscription.


      ## Refund requests


      If you ask Apple for a refund, Apple may ask us for information about
      your use of the App. For Coin Identifier **we do not answer these
      requests**: no information about your use of the App is sent to Apple,
      and Apple makes the refund decision on its own.


      ## Service providers


      We share data only with the service providers needed to run the App,
      and only for that purpose:


      - **OpenAI** processes identification photos and follow-up questions,
      as described above.

      - **Netlify** hosts our AI proxy server and the endpoint that receives
      Apple's subscription notifications. Like any web host, it processes the
      network address a request comes from in order to deliver it; our server
      code does not store that address.

      - **Apple** provides App Attest, in-app purchases and the App Store.


      We do not sell data, and we do not share it with anyone else.


      ## How long data is kept


      - **Photos and questions:** not kept by us. OpenAI may retain them for
      up to 30 days for abuse monitoring, then deletes them.

      - **App Attest key records and monthly counters:** kept on our server
      for as long as we operate the service, because they are how the server
      recognises a genuine copy of the App and enforces the monthly limit.
      They contain no name, e-mail address or account and are not linked to
      your identity.

      - **Subscription notifications:** not kept beyond short-lived server
      logs.

      - **Everything on your device:** until you delete it in the App or
      delete the App (the Keychain information described above may remain).


      ## Camera and photo library


      The App asks for camera access so you can photograph coins. To pick a
      photo from your library it uses the system photo picker, which gives
      the App only the photos you select. Those photos are used only for the
      identification described above. You can change camera access at any
      time in iOS Settings.


      ## Your rights


      Depending on where you live you may have rights to access, correct,
      delete or port personal information, or to object to its processing.
      Because we hold no user database and no account, the practical answer to
      almost every such request is the delete controls in the App and deleting
      the App itself. If you believe we hold something about you, write to us
      at the address below and we will respond.


      ## Children


      The App is not directed at children under 13, and we do not knowingly
      collect personal information from children. Because there is no account,
      we have no children's records to hold.


      ## Security


      The design is the security measure: no account to compromise, no server
      of ours holding your coins or photos, and identification requests that
      are attested and carry no identity. Traffic between the App and our
      server is encrypted in transit, and the server enforces the AI model and
      request limits.


      ## Changes to this policy


      We may update this policy as the App changes. The "last updated" date at
      the top of this page always reflects the current version, and material
      changes will be reflected in the App's disclosures in the same release.


      ## Contact


      Questions about this policy, or about your data:


      **Email:** [burak.guner@outlook.com](mailto:burak.guner@outlook.com)


      **Support:** [bgmobiledev.com/support](/support)
---

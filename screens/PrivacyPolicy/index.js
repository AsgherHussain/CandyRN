import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import { Header } from '../../components'
import i18n from '../../i18n'

function PrivacyPolicy ({ navigation }) {
  return (
    <View style={styles.container}>
      <Header logo back rightEmpty />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tab}>
          <Text style={styles.activeTabText}>{i18n.t('Privacy Policy')}</Text>
          <View style={styles.activeline} />
        </View>
        <Text style={styles.headingText}>{i18n.t('Privacy Policy')}</Text>
        <Text style={styles.paragragh}>
          This privacy policy has been compiled to better serve those who are
          concerned with how their 'Personally Identifiable Information' (PII)
          is being used online. PII, as described in US privacy law and
          information security, is information that can be used on its own or
          with other information to identify, contact, or locate a single
          person, or to identify an individual in context. Please read our
          privacy policy carefully to get a clear understanding of how we
          collect, use, protect or otherwise handle your Personally Identifiable
          Information in accordance with our website. 1. What personal
          information do we collect from the people that visit our blog, website
          or app? 2. When do we collect information? 3. How do we use your
          information? 4. How do we protect your information? 5. Do we use
          'cookies'? 6. Third-party disclosure 7. Google 8. California Online
          Privacy Protection Act 9. How does our site handle Do Not Track
          signals? 10. Does our site allow third-party behavioral tracking? 11.
          COPPA (Children Online Privacy Protection Act) 12. Fair Information
          Practices 1. What personal information do we collect from the people
          that visit our blog, website or app? When ordering or registering on
          our site, as appropriate, you may be asked to enter your name, email
          address, credit card information or other details to help you with
          your experience. 2. When do we collect information? We collect
          information from you when you register on our site, place an order,
          fill out a form or enter information on our site. 3. How do we use
          your information? We may use the information we collect from you when
          you register, make a purchase, sign up for our newsletter, respond to
          a survey or marketing communication, surf the website, or use certain
          other site features in the following ways: To personalize your
          experience and to allow us to deliver the type of content and product
          offerings in which you are most interested. To improve our website in
          order to better serve you. To allow us to better service you in
          responding to your customer service requests. To quickly process your
          transactions. To send periodic emails regarding your order or other
          products and services. 4. How do we protect your information? Our
          website is scanned on a regular basis for security holes and known
          vulnerabilities in order to make your visit to our site as safe as
          possible. We use regular Malware Scanning. Your personal information
          is contained behind secured networks and is only accessible by a
          limited number of persons who have special access rights to such
          systems, and are required to keep the information confidential. In
          addition, all sensitive/credit information you supply is encrypted via
          Secure Socket Layer (SSL) technology. We implement a variety of
          security measures when a user places an order enters, submits, or
          accesses their information to maintain the safety of your personal
          information. All transactions are processed through a gateway provider
          and are not stored or processed on our servers. 5. Do we use
          'cookies'? Yes. Cookies are small files that a site or its service
          provider transfers to your computer's hard drive through your Web
          browser (if you allow) that enables the site's or service provider's
          systems to recognize your browser and capture and remember certain
          information. For instance, we use cookies to help us remember and
          process the items in your shopping cart. They are also used to help us
          understand your preferences based on previous or current site
          activity, which enables us to provide you with improved services. We
          also use cookies to help us compile aggregate data about site traffic
          and site interaction so that we can offer better site experiences and
          tools in the future. We use cookies to: Help remember and process the
          items in the shopping cart. Understand and save user's preferences for
          future visits. Keep track of advertisements. Compile aggregate data
          about site traffic and site interactions in order to offer better site
          experiences and tools in the future. We may also use trusted
          third-party services that track this information on our behalf. You
          can choose to have your computer warn you each time a cookie is being
          sent, or you can choose to turn off all cookies. You do this through
          your browser settings. Since browser is a little different, look at
          your browser's Help Menu to learn the correct way to modify your
          cookies. If users disable cookies in their browser: If you turn
          cookies off, Some of the features that make your site experience more
          efficient may not function properly.Some of the features that make
          your site experience more efficient and may not function properly. 6.
          Third-party disclosure We do not sell, trade, or otherwise transfer to
          outside parties your Personally Identifiable Information unless we
          provide users with advance notice. This does not include website
          hosting partners and other parties who assist us in operating our
          website, conducting our business, or serving our users, so long as
          those parties agree to keep this information confidential. We may also
          release information when it's release is appropriate to comply with
          the law, enforce our site policies, or protect ours or others' rights,
          property or safety. However, non-personally identifiable visitor
          information may be provided to other parties for marketing,
          advertising, or other uses. Third-party links We do not include or
          offer third-party products or services on our website. 7. Google
          Google's advertising requirements can be summed up by Google's
          Advertising Principles. They are put in place to provide a positive
          experience for users.
          https://support.google.com/adwordspolicy/answer/1316548?hl=en We use
          Google AdSense Advertising on our website. Google, as a third-party
          vendor, uses cookies to serve ads on our site. Google's use of the
          DART cookie enables it to serve ads to our users based on previous
          visits to our site and other sites on the Internet. Users may opt-out
          of the use of the DART cookie by visiting the Google Ad and Content
          Network privacy policy. We have implemented the following: We, along
          with third-party vendors such as Google use first-party cookies (such
          as the Google Analytics cookies) and third-party cookies (such as the
          DoubleClick cookie) or other third-party identifiers together to
          compile data regarding user interactions with ad impressions and other
          ad service functions as they relate to our website. Opting out: Users
          can set preferences for how Google advertises to you using the Google
          Ad Settings page. Alternatively, you can opt out by visiting the
          Network Advertising Initiative Opt Out page or by using the Google
          Analytics Opt Out Browser add on. 8. California Online Privacy
          Protection Act CalOPPA is the first state law in the nation to require
          commercial websites and online services to post a privacy policy. The
          law's reach stretches well beyond California to require any person or
          company in the United States (and conceivably the world) that operates
          websites collecting Personally Identifiable Information from
          California consumers to post a conspicuous privacy policy on its
          website stating exactly the information being collected and those
          individuals or companies with whom it is being shared. - See more at:
          http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf
          According to CalOPPA, we agree to the following: Users can visit our
          site anonymously. Once this privacy policy is created, we will add a
          link to it on our home page or as a minimum, on the first significant
          page after entering our website. Our Privacy Policy link includes the
          word 'Privacy' and can easily be found on the page specified above.
          You will be notified of any Privacy Policy changes: On our Privacy
          Policy Page. Can change your personal information: By logging in to
          your account. 9. How does our site handle Do Not Track signals? We
          honor Do Not Track signals and Do Not Track, plant cookies, or use
          advertising when a Do Not Track (DNT) browser mechanism is in place.
          https://support.google.com/adwordspolicy/answer/1316548?hl=en We use
          Google AdSense Advertising on our website. Google, as a third-party
          vendor, uses cookies to serve ads on our site. Google's use of the
          DART cookie enables it to serve ads to our users based on previous
          visits to our site and other sites on the Internet. Users may opt-out
          of the use of the DART cookie by visiting the Google Ad and Content
          Network privacy policy. We have implemented the following: We, along
          with third-party vendors such as Google use first-party cookies (such
          as the Google Analytics cookies) and third-party cookies (such as the
          DoubleClick cookie) or other third-party identifiers together to
          compile data regarding user interactions with ad impressions and other
          ad service functions as they relate to our website. Opting out: Users
          can set preferences for how Google advertises to you using the Google
          Ad Settings page. Alternatively, you can opt out by visiting the
          Network Advertising Initiative Opt Out page or by using the Google
          Analytics Opt Out Browser add on. 10. Does our site allow third-party
          behavioral tracking? It's also important to note that we allow
          third-party behavioral tracking. 11. COPPA (Children Online Privacy
          Protection Act) When it comes to the collection of personal
          information from children under the age of 13 years old, the
          Children's Online Privacy Protection Act (COPPA) puts parents in
          control. The Federal Trade Commission, United States' consumer
          protection agency, enforces the COPPA Rule, which spells out what
          operators of websites and online services must do to protect
          children's privacy and safety online. We do not specifically market to
          children under the age of 13 years old. Do we let third-parties,
          including ad networks or plug-ins collect PII from children under 13?
          12. Fair Information Practices The Fair Information Practices
          Principles form the backbone of privacy law in the United States and
          the concepts they include have played a significant role in the
          development of data protection laws around the globe. Understanding
          the Fair Information Practice Principles and how they should be
          implemented is critical to comply with the various privacy laws that
          protect personal information. In order to be in line with Fair
          Information Practices we will take the following responsive action,
          should a data breach occur: We will notify you via email within 7
          business days We also agree to the Individual Redress Principle which
          requires that individuals have the right to legally pursue enforceable
          rights against data collectors and processors who fail to adhere to
          the law. This principle requires not only that individuals have
          enforceable rights against data users, but also that individuals have
          recourse to courts or government agencies to investigate and/or
          prosecute non-compliance by data processors.
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: '100%',
    paddingTop: 10,
    alignItems: 'center'
  },
  header: {
    width: '90%',
    marginTop: 10
  },
  scrollView: { width: '90%' },
  paragragh: {
    color: COLORS.darkBlack,
    opacity: 0.5,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2.1),
    marginBottom: 20
  },
  headingText: {
    color: COLORS.black,
    width: '100%',
    fontSize: hp('3%'),
    marginTop: '5%',
    marginBottom: '5%',
    fontFamily: FONT1BOLD
  },
  activeTabText: {
    marginBottom: 10,
    color: COLORS.darkBlack,
    fontSize: hp(3),
    fontFamily: FONT1SEMIBOLD
  },
  activeline: {
    width: '100%',
    backgroundColor: COLORS.darkBlack,
    height: 5
  },
  tab: {
    width: '60%',
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center'
  }
})

export default PrivacyPolicy

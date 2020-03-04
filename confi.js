var config = { 
	dashboard: {
		enabled: 'true', // This setting controls whether the dashboard is enabled or not.
		oauthSecret: '', // The client secret from the Discord bot page
		secure: 'true', // HTTPS: 'true' for true, 'false' for false
		sessionSecret: '', // Go crazy on the keyboard here, this is used as a session secret
		domain: 'me-royal-plus', // Domain name (with port if not running behind proxy running on port 80). Example: 'domain': 'dashboard.bot-website.com' OR 'domain': 'localhost:33445'
		port: '3000', // The port that it should run on
		invitePerm: '536079575',
		protectStats: 'false',
		borderedStats: 'false', // Controls whether stats in the dashboard should have a border or not
		legalTemplates: {
			contactEmail: 'admin@ndt3.ml', // This email will be used in the legal page of the dashboard if someone needs to contact you for any reason regarding this page
			lastEdited: '18 November 2017' // Change this if you update the `TERMS.md` or `PRIVACY.md` files in `dashboard/public/`
		}
	}
};

module.exports = config;
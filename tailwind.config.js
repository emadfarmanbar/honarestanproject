module.exports = {
  content: ["./views/**/*.{ejs,html}", "./public/**/*.js"],
       theme: {
        extend: {
          fontFamily: {
            sans: ['Vazirmatn', 'sans-serif'],
          },
          colors: {
            primary: {
              light: '#4f46e5',
              DEFAULT: '#4338ca',
              dark: '#3730a3',
            },
            secondary: {
              light: '#f59e0b',
              DEFAULT: '#d97706',
              dark: '#b45309',
            },
          },
          boxShadow: {
            'neumorphism': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
            'neumorphism-inset': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
          }
        }
      },
  plugins: [

  ],
}
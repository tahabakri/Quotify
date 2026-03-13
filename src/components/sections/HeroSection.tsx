import { motion } from 'framer-motion';
import { SearchBar } from '../search/SearchBar';
import { QuickFilters } from '../search/QuickFilters';
import { scrollFadeUp, premiumTransition, viewportConfig } from '../../lib/animations';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-24 overflow-hidden">
      {/* Decorative gradient blurs */}
      <div className="absolute top-20 right-[15%] w-72 h-72 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-[720px] mx-auto w-full text-center space-y-8 z-10">
        {/* Pill badge */}
        <motion.div
          variants={scrollFadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport={viewportConfig}
          transition={{ ...premiumTransition, delay: 0 }}
        >
          <span className="font-label text-xs px-5 py-2 rounded-pill border border-primary-500/20 text-primary-500 dark:text-primary-300 inline-block">
            Discover Timeless Wisdom
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="font-heading text-5xl sm:text-6xl md:text-7xl text-foreground leading-[0.95]"
          variants={scrollFadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport={viewportConfig}
          transition={{ ...premiumTransition, delay: 0.1 }}
        >
          Explore the World&apos;s Greatest Quotes
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="font-quote text-2xl sm:text-3xl text-primary-500 dark:text-primary-300"
          variants={scrollFadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport={viewportConfig}
          transition={{ ...premiumTransition, delay: 0.2 }}
        >
          From literature&apos;s greatest minds
        </motion.p>

        {/* Body text */}
        <motion.p
          className="font-body text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          variants={scrollFadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport={viewportConfig}
          transition={{ ...premiumTransition, delay: 0.3 }}
        >
          Search, save, and share thousands of inspiring quotes. Build your personal collection of wisdom.
        </motion.p>

        {/* Search section */}
        <motion.div
          className="space-y-4"
          variants={scrollFadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport={viewportConfig}
          transition={{ ...premiumTransition, delay: 0.4 }}
        >
          <SearchBar />
          <QuickFilters />
        </motion.div>

        {/* Stats section */}
        <motion.div
          className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-12 pt-8 border-t border-border"
          variants={scrollFadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport={viewportConfig}
          transition={{ ...premiumTransition, delay: 0.5 }}
        >
          <div className="text-center">
            <div className="font-heading text-3xl text-foreground">1,400+</div>
            <div className="font-label text-muted-foreground mt-1">Quotes</div>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl text-foreground">800+</div>
            <div className="font-label text-muted-foreground mt-1">Authors</div>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl text-foreground">Free</div>
            <div className="font-label text-muted-foreground mt-1">Forever</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

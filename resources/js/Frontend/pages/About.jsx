import React from 'react';
import { Target, Eye, Shield, Users, Award, TrendingUp, ArrowRight, Lightbulb, HeartHandshake, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/utils';
import Button from '../../Components/ui/Button';
import Reveal from '../components/Reveal';
import Counter from '../components/Counter';

const About = () => {
  const values = [
    {
      icon: <Award size={32} />,
      title: 'Excellence',
      desc: 'Nous nous engageons à fournir des services et produits de la plus haute qualité, en respectant les standards internationaux et en dépassant les attentes de nos clients dans chacun de nos projets.'
    },
    {
      icon: <Lightbulb size={32} />,
      title: 'Innovation',
      desc: 'Nous adoptons constamment les dernières technologies et méthodologies pour proposer des solutions avant-gardistes, adaptées aux défis contemporains du développement en Guinée.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Intégrité',
      desc: 'L\'éthique professionnelle et la transparence sont au cœur de nos relations d\'affaires. Nous agissons avec honnêteté et responsabilité envers tous nos partenaires et parties prenantes.'
    },
    {
      icon: <HeartHandshake size={32} />,
      title: 'Engagement Local',
      desc: 'Profondément enracinés en Guinée, nous privilégions l\'emploi local, le développement des compétences nationales et la contribution active à l\'économie et à la société guinéenne.'
    }
  ];

  const stats = [
    { value: '20+', label: 'Années', sublabel: 'd\'expérience' },
    { value: '150+', label: 'Projets', sublabel: 'réalisés' },
    { value: '200+', label: 'Collaborateurs', sublabel: 'qualifiés' },
    { value: '500+', label: 'Clients', sublabel: 'satisfaits' }
  ];

  return (
    <div className="pb-24">
      {/* Header Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop"
            alt="À Propos de GUITRAIM GROUPE"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1A3A5C]/80 backdrop-blur-sm" />
        </div>
        <Reveal className="container relative z-10 px-4 lg:px-8 text-center space-y-6" direction="up">
          <h1 className="text-4xl lg:text-7xl font-bold text-white tracking-tight">
            À Propos de GUITRAIM GROUPE
          </h1>
          <p className="text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto font-medium">
            Un acteur engagé pour le développement de la Guinée
          </p>
          <div className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center justify-center gap-2 pt-4">
            Accueil <ArrowRight size={14} /> À Propos
          </div>
        </Reveal>
      </section>

      {/* Notre Histoire Section */}
      <Reveal className="container px-4 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">Notre Histoire</h2>
            <div className="space-y-6 text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              <p>
                Fondé il y a plus de deux décennies, GUITRAIM GROUPE est né de la vision ambitieuse de contribuer activement au développement économique et infrastructurel de la Guinée. Depuis nos modestes débuts dans le secteur de la construction, nous avons progressivement élargi notre expertise pour devenir un acteur multi-services reconnu.
              </p>
              <p>
                Au fil des années, notre groupe s'est développé de manière stratégique, investissant dans quatre secteurs complémentaires : la construction et le BTP, l'immobilier et le développement foncier, le transport et la logistique, ainsi que les solutions technologiques. Cette diversification nous permet d'offrir à nos clients des solutions intégrées et complètes.
              </p>
              <p>
                Parmi nos réalisations emblématiques, nous comptons la construction du Centre d'Affaires de Kaloum, le développement de la Résidence Les Palmiers, et la mise en place du Hub Logistique National qui connecte efficacement Conakry aux régions de l'intérieur du pays.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1000&auto=format&fit=crop"
                alt="Notre Équipe"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Notre Vision Section */}
      <Reveal className="container px-4 lg:px-8 py-24" direction="none">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
                alt="Notre Vision"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">Notre Vision</h2>
            <div className="space-y-6 text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed italic">
              <p>
                Notre vision est de devenir le partenaire incontournable du développement économique en Guinée, en proposant des solutions innovantes et durables qui répondent aux besoins croissants de notre pays en pleine transformation.
              </p>
              <p className="not-italic">
                Nous aspirons à contribuer significativement à la modernisation des infrastructures guinéennes, tout en créant des emplois locaux et en favorisant le transfert de compétences. Notre ambition est de positionner la Guinée comme un modèle de développement durable en Afrique de l'Ouest.
              </p>
              <p className="not-italic">
                À travers nos quatre piliers d'activité, nous visons à accompagner les entreprises, les institutions et les particuliers dans leurs projets les plus ambitieux, en leur offrant une expertise reconnue et des solutions sur mesure adaptées au contexte local.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Nos Valeurs Section */}
      <section className="bg-[hsla(210,25%,98%,1)] py-24">
        <div className="container px-4 lg:px-8 space-y-16">
          <Reveal className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">Nos Valeurs</h2>
            <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              Les principes fondamentaux qui guident notre action et définissent notre identité d'entreprise
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val, index) => (
              <Reveal key={index} delay={index * 100} direction="up">
                <div className="bg-white p-10 rounded-[32px] border border-[#E0E6ED] h-full space-y-6 hover:shadow-xl transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center group-hover:bg-[#1A3A5C] group-hover:text-white transition-all">
                    {val.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-[#1A3A5C]">{val.title}</h3>
                    <p className="text-base font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 lg:px-8 py-24 space-y-16">
        <Reveal className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">GUITRAIM GROUPE en Chiffres</h2>
          <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
            Des réalisations concrètes qui témoignent de notre expertise et de notre croissance
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Reveal key={index} delay={index * 100} direction="down">
              <div className="bg-white p-8 rounded-[32px] border border-[#E0E6ED] text-center space-y-2 hover:shadow-lg transition-all h-full">
                <div className="text-4xl lg:text-5xl font-black text-[#1A3A5C]">
                  <Counter value={stat.value} duration={2500} />
                </div>
                <div className="text-lg font-bold text-[hsla(210,20%,40%,1)]">{stat.label}</div>
                <div className="text-sm font-medium text-[hsla(210,20%,60%,1)] uppercase tracking-widest">{stat.sublabel}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="pt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-6" direction="none" delay={400}>
          <Link to="/projets">
            <Button className="h-14 px-10 rounded-2xl bg-[#1A3A5C] hover:bg-[#1A3A5C]/90 text-white font-bold text-lg shadow-xl shadow-[#1A3A5C]/20">
              Découvrir Nos Projets
            </Button>
          </Link>
          <Link to="/carrieres">
            <Button variant="outline" className="h-14 px-10 rounded-2xl border-2 border-[#1A3A5C] text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white font-bold text-lg transition-all">
              Rejoindre Notre Équipe
            </Button>
          </Link>
        </Reveal>
      </section>
    </div>
  );
};

export default About;

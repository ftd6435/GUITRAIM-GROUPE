import React, { useEffect, useMemo, useState } from 'react';
import { Target, Eye, Shield, Users, Award, TrendingUp, ArrowRight, Lightbulb, HeartHandshake, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/utils';
import Button from '../../Components/ui/Button';
import Reveal from '../components/Reveal';
import Counter from '../components/Counter';
import api from '../../utils/api';

const About = () => {
  const [page, setPage] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoadingPage(true);
        const response = await api.get('/pages/a-propos');
        setPage(response.data || null);
      } catch (e) {
        setPage(null);
      } finally {
        setLoadingPage(false);
      }
    };
    fetchPage();
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setPartnersLoading(true);
        const response = await api.get('/partners');
        setPartners(response.data || []);
      } catch (e) {
        setPartners([]);
      } finally {
        setPartnersLoading(false);
      }
    };
    fetchPartners();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);
        const response = await api.get('/settings');
        setSettings(response.data || null);
      } catch (e) {
        setSettings(null);
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

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

  const aboutData = useMemo(() => {
    return page?.data || null;
  }, [page?.data]);

  const historyText = aboutData?.history_text || null;
  const visionText = aboutData?.vision_text || null;
  const valuesData = Array.isArray(aboutData?.values) && aboutData.values.length ? aboutData.values : values;
  const statsData = Array.isArray(aboutData?.stats) && aboutData.stats.length ? aboutData.stats : stats;
  const historyImage = page?.history_image_path || null;
  const visionImage = page?.vision_image_path || null;

  return (
    <div className="pb-24">
      {/* Header Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden w-full">
        <div className="absolute inset-0 z-0">
          <img
            src={page?.hero_image_path || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop"}
            alt="À Propos de GUITRAIM GROUPE"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1A3A5C]/80 backdrop-blur-sm" />
        </div>
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 flex justify-center w-full">
          <Reveal className="text-center space-y-6 w-full" direction="up">
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
        </div>
      </section>

      {/* Notre Histoire Section */}
      <section className="flex justify-center w-full py-24">
        <Reveal className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">Notre Histoire</h2>
              {historyText ? (
                <div className="space-y-6 text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed whitespace-pre-line">
                  {historyText}
                </div>
              ) : (
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
              )}
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl">
                <img
                  src={historyImage || "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1000&auto=format&fit=crop"}
                  alt="Notre Équipe"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Notre Vision Section */}
      <section className="flex justify-center w-full py-24">
        <Reveal className="container px-4 sm:px-6 lg:px-8" direction="none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl">
                <img
                  src={visionImage || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"}
                  alt="Notre Vision"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">Notre Vision</h2>
              {visionText ? (
                <div className="space-y-6 text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed whitespace-pre-line">
                  {visionText}
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Nos Valeurs Section */}
      <section className="bg-[hsla(210,25%,98%,1)] py-24 flex justify-center w-full">
        <div className="container px-4 sm:px-6 lg:px-8 space-y-16 w-full">
          <Reveal className="text-center space-y-4 max-w-3xl mx-auto w-full" direction="up">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">Nos Valeurs</h2>
            <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              Les principes fondamentaux qui guident notre action et définissent notre identité d'entreprise
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {valuesData.map((val, index) => {
              const icon = values[index]?.icon || <Award size={32} />;
              const title = val.title || val?.name || '';
              const desc = val.description || val.desc || '';
              return (
                <Reveal key={index} delay={index * 100} direction="up">
                  <div className="bg-white p-10 rounded-[32px] border border-[#E0E6ED] h-full space-y-6 hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center group-hover:bg-[#1A3A5C] group-hover:text-white transition-all">
                      {icon}
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-[#1A3A5C]">{title}</h3>
                      <p className="text-base font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="flex justify-center w-full py-24">
        <div className="container px-4 sm:px-6 lg:px-8 space-y-16 w-full">
          <Reveal className="text-center space-y-4 max-w-3xl mx-auto w-full" direction="up">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">GUITRAIM GROUPE en Chiffres</h2>
            <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              Des réalisations concrètes qui témoignent de notre expertise et de notre croissance
            </p>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
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
        </div>
      </section>

      <section className="flex justify-center w-full py-24">
        <Reveal className="container px-4 sm:px-6 lg:px-8 space-y-12" direction="up">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">Nos Partenaires</h2>
            <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              Un réseau de partenaires solides pour porter des projets ambitieux.
            </p>
          </div>

          {partnersLoading ? (
            <div className="text-center text-sm font-medium text-[hsla(210,20%,40%,1)]">Chargement...</div>
          ) : partners.length ? (
            <div className="partner-marquee overflow-hidden rounded-[32px] border border-[#E0E6ED] bg-white">
              <div className="partner-marquee-track gap-10 py-8 px-6">
                {[...partners, ...partners].map((p, idx) => {
                  const key = `${p.id}-${idx}`;
                  const content = (
                    <div className="h-20 w-44 md:w-56 flex items-center justify-center rounded-[24px] bg-[hsla(210,25%,98%,1)] border border-[#E0E6ED] px-5">
                      {p.logo_path ? (
                        <img src={p.logo_path} alt={p.name} className="max-h-12 max-w-full object-contain" />
                      ) : (
                        <span className="text-xs font-bold text-[hsla(210,20%,50%,1)]">{p.name}</span>
                      )}
                    </div>
                  );
                  return p.website_url ? (
                    <a key={key} href={p.website_url} target="_blank" rel="noreferrer" className="shrink-0 hover:opacity-90 transition-opacity">
                      {content}
                    </a>
                  ) : (
                    <div key={key} className="shrink-0">
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </Reveal>
      </section>

      <section className="flex justify-center w-full py-24">
        <Reveal className="container px-4 sm:px-6 lg:px-8 space-y-12" direction="up">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A3A5C]">Notre Localisation</h2>
            <p className="text-lg font-medium text-[hsla(210,20%,40%,1)] leading-relaxed">
              Retrouvez-nous à Conakry et venez échanger avec notre équipe.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            <div className="bg-white rounded-[32px] border border-[#E0E6ED] p-10 space-y-6">
              <div className="space-y-2">
                <div className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Adresse</div>
                <div className="text-lg font-semibold text-[hsla(210,20%,40%,1)]">
                  {settings?.address || 'Quartier Almamya, Commune de Kaloum, Conakry, Guinée'}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Téléphone</div>
                  <div className="text-base font-semibold text-[hsla(210,20%,40%,1)]">
                    {settings?.phone || '+224 628 xx xx xx'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Email</div>
                  <div className="text-base font-semibold text-[hsla(210,20%,40%,1)]">
                    {settings?.email || 'contact@guitraimgroupe.gn'}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold uppercase tracking-widest text-[#1A3A5C]">Horaires</div>
                <div className="text-base font-semibold text-[hsla(210,20%,40%,1)] whitespace-pre-line">
                  {settings?.working_hours || 'Lun - Ven : 08h00 - 18h00\nSam : 09h00 - 13h00'}
                </div>
              </div>
              {settingsLoading ? (
                <div className="text-sm font-medium text-[hsla(210,20%,50%,1)]">Chargement...</div>
              ) : null}
            </div>

            <div className="bg-white rounded-[32px] border border-[#E0E6ED] overflow-hidden">
              <div className="w-full h-[420px]">
                <iframe
                  title="Carte - GUITRAIM GROUPE"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    settings?.address || 'Quartier Almamya, Commune de Kaloum, Conakry, Guinée'
                  )}&output=embed`}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default About;

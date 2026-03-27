import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, Mail, Send, Download } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../Components/ui/Table';
import { Card, CardContent } from '../../Components/ui/Card';

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/newsletter');
      setSubscribers(response.data);
    } catch (error) {
      console.error('Échec de la récupération des abonnés à la newsletter');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) return;
    try {
      await api.delete(`/newsletter/${id}`);
      fetchSubscribers();
    } catch (error) {
      console.error('Échec de la suppression');
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + subscribers.map(s => `${s.email},${s.created_at}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "abonnes_newsletter.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[hsla(210,30%,20%,1)]">Abonnés Newsletter</h2>
          <p className="text-sm font-medium text-[hsla(210,20%,40%,1)]">Gérez votre liste de diffusion</p>
        </div>
        <Button onClick={exportCSV} variant="secondary" className="gap-2">
          <Download size={18} />
          Exporter en CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin text-[#1A3A5C]" size={32} />
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Adresse Email</TH>
                  <TH>Date d'Inscription</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {subscribers.map((subscriber) => (
                  <TR key={subscriber.id}>
                    <TD>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-[#4A8BC2]" />
                        <span className="font-semibold text-[hsla(210,30%,20%,1)]">{subscriber.email}</span>
                      </div>
                    </TD>
                    <TD>{new Date(subscriber.created_at).toLocaleDateString()}</TD>
                    <TD className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(subscriber.id)} className="text-[#D64545] hover:bg-[#D64545]/10">
                        <Trash2 size={16} />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {subscribers.length === 0 && (
                  <TR>
                    <TD colSpan={3} className="text-center py-12 text-[hsla(210,15%,55%,1)]">
                      Aucun abonné trouvé pour le moment.
                    </TD>
                  </TR>
                )}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#1A3A5C]/5 border-[#1A3A5C]/10">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-[#1A3A5C]">Atteignez votre audience</h3>
            <p className="text-sm text-[hsla(210,20%,40%,1)]">
              Vous avez <span className="font-bold text-[#1A3A5C]">{subscribers.length}</span> abonnés actifs dans votre liste de diffusion.
            </p>
          </div>
          <Button className="gap-2 px-8 h-12 text-base shadow-lg shadow-[#1A3A5C]/20">
            <Send size={18} />
            Composer une Newsletter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Newsletter;

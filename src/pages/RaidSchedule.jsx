import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin  from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { supabase } from '../client';
import EventModal from '../components/EventModal';
import Comments   from '../components/Comments';
import './Schedule.css';

export default function RaidSchedule() {
    const { staticId } = useParams();
    const { user }     = useAuth();
    const [isOwner, setIsOwner] = useState(false);
    const [events, setEvents]       = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});
    const calendarRef               = useRef(null);

    useEffect(() => {
        if (!user) return setIsOwner(false);
        supabase
          .from('statics')
          .select('created_by')
          .eq('id', staticId)
          .single()
          .then(({ data }) => {
            setIsOwner(data?.created_by === user.id);
          });
      }, [staticId, user]);

    const fetchEvents = async () => {
        const { data, error } = await supabase
        .from('events')
        .select('id, title, start, end')
        .eq('static_id', staticId)
        .order('start');
    
        if (error) {
        console.error('Error loading events:', error);
        return;
        }

        setEvents(
        (data || []).map(evt => ({
            id:    evt.id,
            title: evt.title,
            start: evt.start ? new Date(evt.start) : null,
            end:   evt.end   ? new Date(evt.end)   : null,
        }))
        );
    };

    useEffect(() => { fetchEvents(); }, [staticId]);

    const onDateClick = (arg) => {
        if (!isOwner) return; 
        setModalData({
        title: '',
        start: arg.date.toISOString(),
        end:   new Date(arg.date.getTime() + 3600_000).toISOString(),
        });
        setModalOpen(true);
    };

    const onEventClick = ({ event }) => {
        if (!isOwner) return; 
        setModalData({
        id:    event.id,
        title: event.title,
        start: event.start.toISOString(),
        end:   (event.end || event.start).toISOString(),
        });
        setModalOpen(true);
    };

    const handleModalSubmit = async ({ id, title, start, end }) => {
        const startISO = new Date(start).toISOString();
        const endISO   = new Date(end).toISOString();
        const payload = { title, start: startISO, end: endISO, static_id: staticId };

        if (id) {
            await supabase.from('events').update(payload).eq('id', id);
        } else {
            await supabase.from('events').insert(payload);
        }

        setModalOpen(false);
        await fetchEvents();
        calendarRef.current?.getApi().refetchEvents();
    };

    const handleModalDelete = async (id) => {
        try {
        await supabase.from('events').delete().eq('id', id);
        } catch (err) {
        console.error('Delete failed:', err);
        alert('Error deleting event: ' + err.message);
        } finally {
        setModalOpen(false);
        await fetchEvents();
        calendarRef.current?.getApi().refetchEvents();
        }
    };

    return (
        <div className="page page--schedule">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                left:   'prev,next today',
                center: 'title',
                right:  'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                dateClick={isOwner ? onDateClick : undefined}
                eventClick={isOwner ? onEventClick : undefined}
                selectable={true}
                height="auto"
            />

            <EventModal
                isOpen={modalOpen}
                initialData={modalData}
                onClose={() => setModalOpen(false)}
                onSubmit={handleModalSubmit}
                onDelete={modalData.id ? handleModalDelete : null}
            />

            <Comments staticId={staticId} />
        </div>
    );
}

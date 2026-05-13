import sqlite3, uuid, datetime
p=r'C:/Users/Agniv Dutta/Parcour/parcour.db'
conn=sqlite3.connect(p)
c=conn.cursor()
try:
    c.execute('PRAGMA foreign_keys = ON')
    c.executescript('''
    DELETE FROM messages;
    DELETE FROM conversations;
    DELETE FROM reservations;
    DELETE FROM guest_profiles;
    ''')
    now=datetime.datetime.utcnow()
    def ts(offset_secs=0):
        return (now - datetime.timedelta(seconds=offset_secs)).isoformat()
    # guests
    g1=str(uuid.uuid4())
    g2=str(uuid.uuid4())
    g3=str(uuid.uuid4())
    g4=str(uuid.uuid4())
    c.execute('INSERT INTO guest_profiles (id,name,email,phone,channels) VALUES (?,?,?,?,?)',(g1,'Rahul Sharma',None,None,'[]'))
    c.execute('INSERT INTO guest_profiles (id,name,email,phone,channels) VALUES (?,?,?,?,?)',(g2,'Priya Mehta',None,None,'[]'))
    c.execute('INSERT INTO guest_profiles (id,name,email,phone,channels) VALUES (?,?,?,?,?)',(g3,'Arjun Nair',None,None,'[]'))
    c.execute('INSERT INTO guest_profiles (id,name,email,phone,channels) VALUES (?,?,?,?,?)',(g4,'Kavya Reddy',None,None,'[]'))
    # reservations
    r1=str(uuid.uuid4())
    r2=str(uuid.uuid4())
    r3=str(uuid.uuid4())
    c.execute('INSERT INTO reservations (id,booking_ref,property_id,guest_id,check_in,check_out,status) VALUES (?,?,?,?,?,?,?)',(r1,'NIS-2024-0891','villa-b1',g1,None,None,'confirmed'))
    c.execute('INSERT INTO reservations (id,booking_ref,property_id,guest_id,check_in,check_out,status) VALUES (?,?,?,?,?,?,?)',(r2,'PRY-2025-0042','villa-b2',g2,None,None,'confirmed'))
    c.execute('INSERT INTO reservations (id,booking_ref,property_id,guest_id,check_in,check_out,status) VALUES (?,?,?,?,?,?,?)',(r3,'BR-456','villa-b1',g3,None,None,'confirmed'))
    # conversations
    conv1=str(uuid.uuid4())
    conv2=str(uuid.uuid4())
    conv3=str(uuid.uuid4())
    conv4=str(uuid.uuid4())
    c.execute('INSERT INTO conversations (id,guest_id,reservation_id,property_id,channel) VALUES (?,?,?,?,?)',(conv1,g1,r1,'villa-b1','whatsapp'))
    c.execute('INSERT INTO conversations (id,guest_id,reservation_id,property_id,channel) VALUES (?,?,?,?,?)',(conv2,g2,r2,'villa-b2','airbnb'))
    c.execute('INSERT INTO conversations (id,guest_id,reservation_id,property_id,channel) VALUES (?,?,?,?,?)',(conv3,g3,r3,'villa-b1','booking_com'))
    c.execute('INSERT INTO conversations (id,guest_id,reservation_id,property_id,channel) VALUES (?,?,?,?,?)',(conv4,g4,None,'villa-b3','instagram'))
    # messages
    m1=str(uuid.uuid4())
    m2=str(uuid.uuid4())
    m3=str(uuid.uuid4())
    m4=str(uuid.uuid4())
    c.execute('INSERT INTO messages (id,conversation_id,source,direction,message_text,query_type,confidence_score,drafted_reply,action,ai_drafted,agent_edited,auto_sent,timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
              (m1,conv1,'whatsapp','inbound','Is the villa available on April 21-23?','pre_sales_availability',0.92,'Hi Rahul — the villa is available on those dates. Would you like me to hold the dates?','agent_review',1,0,0,ts(2)))
    c.execute('INSERT INTO messages (id,conversation_id,source,direction,message_text,query_type,confidence_score,drafted_reply,action,ai_drafted,agent_edited,auto_sent,timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
              (m2,conv2,'airbnb','inbound','The air conditioning is not working and this is unacceptable','complaint',0.98,"We're very sorry Priya — we will dispatch maintenance immediately and follow up.", 'escalate',1,0,0,ts(2)))
    c.execute('INSERT INTO messages (id,conversation_id,source,direction,message_text,query_type,confidence_score,drafted_reply,action,ai_drafted,agent_edited,auto_sent,timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
              (m3,conv3,'booking_com','inbound','Hi, what\'s the wifi password?','post_sales_checkin',0.85,'Hi Arjun — the WiFi password is Parcour@2024','auto_send',1,0,1,ts(2)))
    c.execute('INSERT INTO messages (id,conversation_id,source,direction,message_text,query_type,confidence_score,drafted_reply,action,ai_drafted,agent_edited,auto_sent,timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
              (m4,conv4,'instagram','inbound','Do you offer airport pickup?','special_request',0.8,'Yes Kavya — we can arrange airport pickup for an additional charge. Would you like a quote?','agent_review',1,0,0,ts(2)))
    conn.commit()
    print('inserted')
except Exception as e:
    print('err', e)
finally:
    conn.close()

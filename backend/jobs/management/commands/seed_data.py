import datetime
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.contrib.auth.models import User
from jobs.models import Student, Job, WorkSchedule, Application, Evaluation, JobType, JobStatus, ApplicationStatus


class Command(BaseCommand):
    help = 'Seeds realistic mock data for PSU Part-time Job Hub (Students, Jobs, Schedules, Applications, Evaluations)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing jobs, schedules, applications, evaluations, and test students before seeding',
        )
        parser.add_argument(
            '--dump',
            action='store_true',
            default=True,
            help='Automatically dump seeded database state into backend/seed_data.json fixture (default: True)',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting database seeding...'))

        if options['clear']:
            self.stdout.write(self.style.WARNING('Clearing existing mock data...'))
            Evaluation.objects.all().delete()
            Application.objects.all().delete()
            WorkSchedule.objects.all().delete()
            Job.objects.all().delete()
            # Delete test student users (excluding main admin or staff)
            Student.objects.all().delete()
            User.objects.filter(is_superuser=False, is_staff=False).delete()
            self.stdout.write(self.style.SUCCESS('Cleared old mock data.'))

        # -------------------------------------------------------------------------
        # 1. Ensure Superuser / Admin Accounts
        # -------------------------------------------------------------------------
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@phuket.psu.ac.th',
                'first_name': 'System',
                'last_name': 'Administrator',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created or not admin_user.has_usable_password():
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created default admin: admin / admin123'))

        # Staff user
        staff_user, _ = User.objects.get_or_create(
            username='staff',
            defaults={
                'email': 'staff@phuket.psu.ac.th',
                'first_name': 'Faculty',
                'last_name': 'Staff',
                'is_staff': True,
                'is_superuser': False,
            }
        )
        staff_user.set_password('staff123')
        staff_user.save()

        # -------------------------------------------------------------------------
        # 2. Seed Students Across All 4 PSU Phuket Faculties (14 Students)
        # -------------------------------------------------------------------------
        mock_students_data = [
            # College of Computing (CoC)
            {
                'student_id': '6630613009',
                'first_name': 'Panichapon',
                'last_name': 'Chatdaeng',
                'faculty': 'College of Computing',
                'major': 'Digital Engineering',
                'religion': 'Buddhism',
                'allergies': 'None',
            },
            {
                'student_id': '6630613001',
                'first_name': 'Somchai',
                'last_name': 'Prasert',
                'faculty': 'College of Computing',
                'major': 'Digital Engineering',
                'religion': 'Buddhism',
                'allergies': 'None',
            },
            {
                'student_id': '6630613002',
                'first_name': 'Nattapong',
                'last_name': 'Sukchai',
                'faculty': 'College of Computing',
                'major': 'Software Engineering',
                'religion': 'Buddhism',
                'allergies': 'Peanuts',
            },
            {
                'student_id': '6630613003',
                'first_name': 'Kanya',
                'last_name': 'Wongsuwan',
                'faculty': 'College of Computing',
                'major': 'Information Technology',
                'religion': 'Christianity',
                'allergies': 'None',
            },
            {
                'student_id': '6630613004',
                'first_name': 'Lin',
                'last_name': 'Wei',
                'faculty': 'College of Computing',
                'major': 'Artificial Intelligence',
                'religion': 'None',
                'allergies': 'Seafood',
            },

            # Faculty of Hospitality & Tourism (FHT)
            {
                'student_id': '6630613005',
                'first_name': 'Emily',
                'last_name': 'Watson',
                'faculty': 'Faculty of Hospitality & Tourism',
                'major': 'Hospitality Management',
                'religion': 'Christianity',
                'allergies': 'Dairy',
            },
            {
                'student_id': '6630613006',
                'first_name': 'Pimchanok',
                'last_name': 'Boonmee',
                'faculty': 'Faculty of Hospitality & Tourism',
                'major': 'Tourism Management',
                'religion': 'Buddhism',
                'allergies': 'None',
            },
            {
                'student_id': '6630613007',
                'first_name': 'Siriporn',
                'last_name': 'Saetang',
                'faculty': 'Faculty of Hospitality & Tourism',
                'major': 'Service Innovation',
                'religion': 'Buddhism',
                'allergies': 'None',
            },

            # Faculty of International Studies (FIS)
            {
                'student_id': '6630613008',
                'first_name': 'Thanakorn',
                'last_name': 'Jaidee',
                'faculty': 'Faculty of International Studies',
                'major': 'International Business: China',
                'religion': 'Buddhism',
                'allergies': 'None',
            },
            {
                'student_id': '6630613010',
                'first_name': 'Muhammad',
                'last_name': 'Ibrahim',
                'faculty': 'Faculty of International Studies',
                'major': 'International Business',
                'religion': 'Islam',
                'allergies': 'Crustaceans',
            },
            {
                'student_id': '6630613014',
                'first_name': 'Sornsawan',
                'last_name': 'Meesuk',
                'faculty': 'Faculty of International Studies',
                'major': 'International Studies',
                'religion': 'Buddhism',
                'allergies': 'None',
            },

            # Faculty of Technology & Environment (FTE)
            {
                'student_id': '6630613011',
                'first_name': 'Ananya',
                'last_name': 'Charoenrat',
                'faculty': 'Faculty of Technology & Environment',
                'major': 'Environmental Science',
                'religion': 'Buddhism',
                'allergies': 'Pollen',
            },
            {
                'student_id': '6630613012',
                'first_name': 'Chaiwat',
                'last_name': 'Rattanasiri',
                'faculty': 'Faculty of Technology & Environment',
                'major': 'Geoinformatics',
                'religion': 'Buddhism',
                'allergies': 'None',
            },
            {
                'student_id': '6630613013',
                'first_name': 'Farida',
                'last_name': 'Yusof',
                'faculty': 'Faculty of Technology & Environment',
                'major': 'Environmental Technology',
                'religion': 'Islam',
                'allergies': 'None',
            },
        ]

        students = []
        for s_data in mock_students_data:
            user, _ = User.objects.get_or_create(
                username=s_data['student_id'],
                defaults={
                    'email': f"s{s_data['student_id']}@phuket.psu.ac.th",
                    'first_name': s_data['first_name'],
                    'last_name': s_data['last_name'],
                    'is_staff': False,
                    'is_superuser': False,
                }
            )
            user.set_password('student123')
            user.save()

            student, _ = Student.objects.update_or_create(
                student_id=s_data['student_id'],
                defaults={
                    'user': user,
                    'first_name': s_data['first_name'],
                    'last_name': s_data['last_name'],
                    'faculty': s_data['faculty'],
                    'major': s_data['major'],
                    'religion': s_data['religion'],
                    'allergies': s_data['allergies'],
                }
            )
            students.append(student)

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(students)} students across 4 faculties (Password: student123).'))

        # -------------------------------------------------------------------------
        # 3. Seed 30 Diverse Jobs (Internal & External, 1/3 with stock photo URLs)
        # -------------------------------------------------------------------------
        mock_jobs_data = [
            # Job 0 - [Thumbnail 1/10]
            {
                'title': 'Library Student Assistant',
                'organization_name': 'PSU Phuket Central Library',
                'description': 'Assist librarians with cataloging, book shelving, student entry check-in, and managing quiet study room bookings.',
                'location_type': 'Central Library 2nd Floor',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('350.00'),
                'required_amount': 4,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
                'line_group_url': 'https://line.me/ti/g/example-library',
                'schedules': [
                    {'date': datetime.date(2026, 10, 12), 'start': '09:00', 'end': '16:00'},
                    {'date': datetime.date(2026, 10, 13), 'start': '09:00', 'end': '16:00'},
                ]
            },
            # Job 1 - [Thumbnail 2/10]
            {
                'title': 'Student IT Helpdesk & Lab Attendant',
                'organization_name': 'College of Computing',
                'description': 'Provide basic hardware and software troubleshooting for computer lab workstations and assist instructors with lab setups.',
                'location_type': 'Building 6, Computer Lab 6301',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('400.00'),
                'required_amount': 3,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
                'line_group_url': 'https://line.me/ti/g/example-it',
                'schedules': [
                    {'date': datetime.date(2026, 10, 15), 'start': '08:30', 'end': '16:30'},
                    {'date': datetime.date(2026, 10, 16), 'start': '08:30', 'end': '16:30'},
                ]
            },
            # Job 2 - [No Thumbnail]
            {
                'title': 'PSU Open House Campus Ambassador',
                'organization_name': 'Division of Student Development',
                'description': 'Act as campus guides for visiting high school students, manage registration booths, and distribute orientation goodie bags.',
                'location_type': 'PSU Phuket Auditorium & Campus Grounds',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('450.00'),
                'required_amount': 6,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-openhouse',
                'schedules': [
                    {'date': datetime.date(2026, 11, 5), 'start': '08:00', 'end': '17:00'},
                    {'date': datetime.date(2026, 11, 6), 'start': '08:00', 'end': '17:00'},
                ]
            },
            # Job 3 - [Thumbnail 3/10]
            {
                'title': 'Sports Complex & Gym Attendant',
                'organization_name': 'Student Affairs & Sports Center',
                'description': 'Check student IDs at entrance, sanitize equipment, oversee badminton court reservations, and monitor fitness room safety.',
                'location_type': 'PSU Gymnasium & Fitness Center',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('300.00'),
                'required_amount': 2,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
                'line_group_url': 'https://line.me/ti/g/example-gym',
                'schedules': [
                    {'date': datetime.date(2026, 10, 20), 'start': '16:00', 'end': '20:00'},
                    {'date': datetime.date(2026, 10, 21), 'start': '16:00', 'end': '20:00'},
                ]
            },
            # Job 4 - [No Thumbnail]
            {
                'title': 'International Conference Registration Staff',
                'organization_name': 'Faculty of International Studies',
                'description': 'Welcome foreign dignitaries and delegates, assist with English/Chinese conference packet distribution, and usher attendees.',
                'location_type': 'Conference Hall Building 3',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('600.00'),
                'required_amount': 4,
                'status': JobStatus.IN_PROGRESS,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-conf',
                'schedules': [
                    {'date': datetime.date(2026, 9, 28), 'start': '08:00', 'end': '16:30'},
                ]
            },
            # Job 5 - [Thumbnail 4/10]
            {
                'title': 'Eco-Campus Greenery & Waste Audit Assistant',
                'organization_name': 'Faculty of Technology & Environment',
                'description': 'Collect campus recycling metrics, inspect solar monitoring stations, and record data on student sustainability initiatives.',
                'location_type': 'Building 7 Eco-Center',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('380.00'),
                'required_amount': 3,
                'status': JobStatus.OPEN,
                'academic_term': 1,
                'academic_year': 2569,
                'poster_image_url': 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
                'line_group_url': 'https://line.me/ti/g/example-eco',
                'schedules': [
                    {'date': datetime.date(2026, 7, 10), 'start': '09:00', 'end': '15:00'},
                ]
            },
            # Job 6 - [Thumbnail 5/10]
            {
                'title': 'Language Experience Workshop Support',
                'organization_name': 'Student Development & Alumni Relations',
                'description': 'Assist language instructors in running conversational games and cultural booths for freshman students.',
                'location_type': 'Student Union Activity Room',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('300.00'),
                'required_amount': 2,
                'status': JobStatus.COMPLETED,
                'academic_term': 2,
                'academic_year': 2568,
                'poster_image_url': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
                'line_group_url': 'https://line.me/ti/g/example-lang',
                'schedules': [
                    {'date': datetime.date(2025, 11, 14), 'start': '13:00', 'end': '17:00'},
                ]
            },
            # Job 7 - [Thumbnail 6/10]
            {
                'title': 'Audio-Visual Sound & Stage Technician',
                'organization_name': 'Professional Sound Co. / PSU Events',
                'description': 'Set up microphone lines, test live monitors, arrange cabling, and operate stage lights during campus ceremonial events.',
                'location_type': 'Main Conference Hall',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('800.00'),
                'required_amount': 2,
                'status': JobStatus.CLOSED,
                'academic_term': 2,
                'academic_year': 2568,
                'poster_image_url': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
                'line_group_url': 'https://line.me/ti/g/example-av',
                'schedules': [
                    {'date': datetime.date(2025, 12, 10), 'start': '10:00', 'end': '19:00'},
                ]
            },
            # Job 8 - [Thumbnail 7/10]
            {
                'title': 'Campus Coffee Corner Barista & Cashier',
                'organization_name': 'Faculty of Hospitality & Tourism (FHT)',
                'description': 'Prepare espresso beverages, operate POS register, sanitize cafe counter tables, and manage beverage stock inventory.',
                'location_type': 'Building 5 Ground Floor Cafe',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('360.00'),
                'required_amount': 3,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                'line_group_url': 'https://line.me/ti/g/example-cafe',
                'schedules': [
                    {'date': datetime.date(2026, 10, 18), 'start': '08:00', 'end': '13:00'},
                    {'date': datetime.date(2026, 10, 19), 'start': '12:00', 'end': '17:00'},
                ]
            },
            # Job 9 - [Thumbnail 8/10]
            {
                'title': 'Student Affairs Graphic Design & Poster Creator',
                'organization_name': 'Division of Student Affairs',
                'description': 'Design promotional event posters, social media banners, and infographics for upcoming campus extracurricular activities.',
                'location_type': 'Student Union Office / Remote',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('500.00'),
                'required_amount': 2,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
                'line_group_url': 'https://line.me/ti/g/example-graphic',
                'schedules': [
                    {'date': datetime.date(2026, 10, 22), 'start': '10:00', 'end': '16:00'},
                ]
            },
            # Job 10 - [No Thumbnail]
            {
                'title': 'PSU Swimming Pool Lifeguard & Safety Monitor',
                'organization_name': 'Campus Physical Education & Recreation',
                'description': 'Supervise lap swimming sessions, verify water quality parameters, test life rings, and enforce pool safety regulations.',
                'location_type': 'PSU Phuket Olympic Swimming Pool',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('450.00'),
                'required_amount': 3,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-pool',
                'schedules': [
                    {'date': datetime.date(2026, 10, 28), 'start': '15:30', 'end': '19:30'},
                ]
            },
            # Job 11 - [No Thumbnail]
            {
                'title': 'Registrar Office Document Scanning Clerk',
                'organization_name': 'Academic Services & Registrar Office',
                'description': 'Scan and index historical student graduation records, digitize paper transcripts, and perform optical character recognition checks.',
                'location_type': 'President Building 1st Floor',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('320.00'),
                'required_amount': 2,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-reg',
                'schedules': [
                    {'date': datetime.date(2026, 11, 2), 'start': '09:00', 'end': '16:00'},
                ]
            },
            # Job 12 - [No Thumbnail]
            {
                'title': 'Botanical Greenhouse Flora Research Assistant',
                'organization_name': 'Faculty of Technology & Environment (FTE)',
                'description': 'Monitor soil moisture sensors, water native mangrove flora specimens, and catalog weekly biological plant growth measurements.',
                'location_type': 'FTE Botanical Research Nursery',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('350.00'),
                'required_amount': 2,
                'status': JobStatus.OPEN,
                'academic_term': 1,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-flora',
                'schedules': [
                    {'date': datetime.date(2026, 7, 18), 'start': '08:30', 'end': '12:30'},
                ]
            },
            # Job 13 - [No Thumbnail]
            {
                'title': 'Student Dormitory Night Study Hall Proctor',
                'organization_name': 'Student Housing Management Office',
                'description': 'Maintain quiet study atmosphere, inspect air-conditioning timers, and verify resident sign-ins during final exam week.',
                'location_type': 'Dormitory Building 2 Common Room',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('300.00'),
                'required_amount': 2,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2568,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-dorm',
                'schedules': [
                    {'date': datetime.date(2026, 3, 2), 'start': '19:00', 'end': '23:00'},
                ]
            },
            # Job 14 - [No Thumbnail]
            {
                'title': 'International Campus Tour Guide for ASEAN Delegates',
                'organization_name': 'International Affairs Center (IAC)',
                'description': 'Escort visiting ASEAN university delegates, present campus landmark histories in English, and coordinate protocol lunch seating.',
                'location_type': 'International Affairs Center Building 3',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('550.00'),
                'required_amount': 3,
                'status': JobStatus.IN_PROGRESS,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-tour',
                'schedules': [
                    {'date': datetime.date(2026, 10, 8), 'start': '09:00', 'end': '15:00'},
                ]
            },
            # Job 15 - [No Thumbnail]
            {
                'title': 'University Bookstore Textbook Stock Clerk',
                'organization_name': 'PSU Cooperative Bookstore',
                'description': 'Unbox incoming semester textbooks, affix barcode labels, organize academic stationery aisles, and assist customer inquiries.',
                'location_type': 'Student Union 1st Floor Bookstore',
                'job_type': JobType.INTERNAL,
                'compensation_amount': Decimal('320.00'),
                'required_amount': 2,
                'status': JobStatus.CLOSED,
                'academic_term': 1,
                'academic_year': 2568,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-books',
                'schedules': [
                    {'date': datetime.date(2025, 6, 20), 'start': '10:00', 'end': '17:00'},
                ]
            },

            # =========================================================================
            # External Jobs (Community, Industry & Events in Phuket)
            # =========================================================================
            # Job 16 - [No Thumbnail]
            {
                'title': 'Andamanda Phuket Songkran Festival Crew',
                'organization_name': 'Andamanda Water Park Phuket',
                'description': 'Provide guest assistance, manage locker rentals, hand out wristbands, and coordinate festival staging area logistics.',
                'location_type': 'Andamanda Phuket, Kathu',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('600.00'),
                'required_amount': 5,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-andamanda',
                'schedules': [
                    {'date': datetime.date(2026, 4, 13), 'start': '10:00', 'end': '18:00'},
                    {'date': datetime.date(2026, 4, 14), 'start': '10:00', 'end': '18:00'},
                ]
            },
            # Job 17 - [No Thumbnail]
            {
                'title': 'Central Phuket International Food Fair Staff',
                'organization_name': 'Central Phuket Floresta',
                'description': 'Assist international culinary chefs, manage sampling stations, guide tourists, and oversee culinary sanitation compliance.',
                'location_type': 'Central Phuket Festival Hall',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('550.00'),
                'required_amount': 4,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-central',
                'schedules': [
                    {'date': datetime.date(2026, 10, 24), 'start': '11:00', 'end': '19:00'},
                    {'date': datetime.date(2026, 10, 25), 'start': '11:00', 'end': '19:00'},
                ]
            },
            # Job 18 - [Thumbnail 9/10]
            {
                'title': 'Phuket Marathon Route & Hydration Marshal',
                'organization_name': 'Laguna Phuket Triathlon Org',
                'description': 'Station at water points along the marathon course, pass electrolytes to runners, report medical emergencies, and cheer athletes.',
                'location_type': 'Bang Tao & Laguna Beach Course',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('700.00'),
                'required_amount': 6,
                'status': JobStatus.OPEN,
                'academic_term': 1,
                'academic_year': 2569,
                'poster_image_url': 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80',
                'line_group_url': 'https://line.me/ti/g/example-marathon',
                'schedules': [
                    {'date': datetime.date(2026, 6, 7), 'start': '04:00', 'end': '11:00'},
                ]
            },
            # Job 19 - [No Thumbnail]
            {
                'title': 'Old Phuket Town Cultural Street Fair Coordinator',
                'organization_name': 'Phuket Heritage & Tourism Board',
                'description': 'Manage pedestrian flow along Thalang Road, provide directions in Thai/English/Chinese, and assist traditional craft stalls.',
                'location_type': 'Thalang Road, Old Town Phuket',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('500.00'),
                'required_amount': 4,
                'status': JobStatus.IN_PROGRESS,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-heritage',
                'schedules': [
                    {'date': datetime.date(2026, 10, 4), 'start': '15:00', 'end': '22:00'},
                ]
            },
            # Job 20 - [No Thumbnail]
            {
                'title': 'Municipal Election Unit Volunteer',
                'organization_name': 'Municipality of Ratsada',
                'description': 'Direct eligible voters to correct polling stations, verify identification documents, and ensure ballot secrecy guidelines are met.',
                'location_type': 'Ratsada Community Hall',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('1200.00'),
                'required_amount': 3,
                'status': JobStatus.COMPLETED,
                'academic_term': 2,
                'academic_year': 2568,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-election',
                'schedules': [
                    {'date': datetime.date(2025, 12, 21), 'start': '07:30', 'end': '17:30'},
                ]
            },
            # Job 21 - [Thumbnail 10/10]
            {
                'title': 'EDC Electronic Music Festival Event Crew',
                'organization_name': 'Insomniac Asia Entertainment',
                'description': 'VIP entrance accreditation, backstage wristband scanning, credential checks, and guest hospitality assistance.',
                'location_type': 'Phuket Event Center',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('900.00'),
                'required_amount': 5,
                'status': JobStatus.COMPLETED,
                'academic_term': 1,
                'academic_year': 2568,
                'poster_image_url': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
                'line_group_url': 'https://line.me/ti/g/example-edc',
                'schedules': [
                    {'date': datetime.date(2025, 8, 16), 'start': '14:00', 'end': '23:00'},
                ]
            },
            # Job 22 - [No Thumbnail]
            {
                'title': 'Laguna Phuket Golf Championship Scorekeeper',
                'organization_name': 'Laguna Golf Club Phuket',
                'description': 'Accompany professional golf flights, input real-time hole strokes onto tablet scoring system, and post leaderboard updates.',
                'location_type': 'Laguna Golf Course, Cherngtalay',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('850.00'),
                'required_amount': 4,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-golf',
                'schedules': [
                    {'date': datetime.date(2026, 11, 12), 'start': '06:30', 'end': '14:30'},
                ]
            },
            # Job 23 - [No Thumbnail]
            {
                'title': 'Phuket International Boat Show Marina Expo Usher',
                'organization_name': 'Royal Phuket Marina Exhibition',
                'description': 'Greet high-net-worth yacht visitors, manage pier pontoon access passes, and assist VIP lounge champagne service.',
                'location_type': 'Royal Phuket Marina, Koh Kaew',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('750.00'),
                'required_amount': 4,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-yacht',
                'schedules': [
                    {'date': datetime.date(2026, 11, 20), 'start': '10:00', 'end': '18:00'},
                ]
            },
            # Job 24 - [No Thumbnail]
            {
                'title': 'Patong Beach Marine Conservation Volunteer',
                'organization_name': 'Phuket Marine Biological Center (PMBC)',
                'description': 'Lead beach microplastic screening with community volunteers, document coral debris, and distribute educational leaflets.',
                'location_type': 'Patong Beachfront Promenade',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('400.00'),
                'required_amount': 5,
                'status': JobStatus.OPEN,
                'academic_term': 1,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-patong',
                'schedules': [
                    {'date': datetime.date(2026, 6, 21), 'start': '08:00', 'end': '14:00'},
                ]
            },
            # Job 25 - [No Thumbnail]
            {
                'title': 'Kata Rocks Luxury Culinary Showcase Assistant',
                'organization_name': 'Kata Rocks Resort & Residences',
                'description': 'Support Michelin-star guest chef prep stations, polish wine glasses, distribute canapé trays, and verify guest wristbands.',
                'location_type': 'Kata Rocks Oceanfront Terrace',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('800.00'),
                'required_amount': 3,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-katarocks',
                'schedules': [
                    {'date': datetime.date(2026, 12, 5), 'start': '16:00', 'end': '22:00'},
                ]
            },
            # Job 26 - [No Thumbnail]
            {
                'title': 'Bang Tao Night Market Parking & Traffic Marshal',
                'organization_name': 'Cherngtalay Subdistrict Organization',
                'description': 'Direct tourist motorbikes and taxis into parking bays, manage crosswalk pedestrian safety, and assist traffic police.',
                'location_type': 'Bang Tao Night Market Grounds',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('450.00'),
                'required_amount': 3,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-traffic',
                'schedules': [
                    {'date': datetime.date(2026, 10, 30), 'start': '17:00', 'end': '22:00'},
                ]
            },
            # Job 27 - [No Thumbnail]
            {
                'title': 'Phuket International Airport Tourist Hospitality Greeter',
                'organization_name': 'Airports of Thailand (AOT) Phuket',
                'description': 'Assist international arrivals with customs queue direction, answer transit bus queries, and distribute Phuket safety guides.',
                'location_type': 'HKT Airport International Terminal',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('650.00'),
                'required_amount': 4,
                'status': JobStatus.IN_PROGRESS,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-airport',
                'schedules': [
                    {'date': datetime.date(2026, 10, 1), 'start': '08:00', 'end': '16:00'},
                ]
            },
            # Job 28 - [No Thumbnail]
            {
                'title': 'Old Town Heritage Walk English & Chinese Interpreter',
                'organization_name': 'Phuket Baba Heritage Association',
                'description': 'Lead 45-minute walking history tours through Soi Rommanee, explaining Sino-Portuguese architecture to foreign tourists.',
                'location_type': 'Soi Rommanee & Krabi Road, Old Town',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('600.00'),
                'required_amount': 3,
                'status': JobStatus.OPEN,
                'academic_term': 2,
                'academic_year': 2569,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-babawalk',
                'schedules': [
                    {'date': datetime.date(2026, 11, 8), 'start': '09:30', 'end': '15:30'},
                ]
            },
            # Job 29 - [No Thumbnail]
            {
                'title': 'Phuket Aquarium Marine Habitat Volunteer',
                'organization_name': 'Department of Marine and Coastal Resources',
                'description': 'Assist marine biologists with food preparation for sea turtles, clean filtration screens, and guide school field trip groups.',
                'location_type': 'Cape Panwa Phuket Aquarium',
                'job_type': JobType.EXTERNAL,
                'compensation_amount': Decimal('500.00'),
                'required_amount': 3,
                'status': JobStatus.COMPLETED,
                'academic_term': 1,
                'academic_year': 2568,
                'poster_image_url': None,
                'line_group_url': 'https://line.me/ti/g/example-aquarium',
                'schedules': [
                    {'date': datetime.date(2025, 7, 26), 'start': '09:00', 'end': '16:00'},
                ]
            },
        ]

        seeded_jobs = []
        for j_data in mock_jobs_data:
            schedules_data = j_data.pop('schedules')
            job, _ = Job.objects.update_or_create(
                title=j_data['title'],
                academic_year=j_data['academic_year'],
                academic_term=j_data['academic_term'],
                defaults=j_data
            )
            seeded_jobs.append(job)

            # Schedules
            for sched in schedules_data:
                WorkSchedule.objects.get_or_create(
                    job=job,
                    date=sched['date'],
                    defaults={
                        'start_time': sched['start'],
                        'end_time': sched['end'],
                    }
                )

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(seeded_jobs)} jobs with work schedules.'))

        # -------------------------------------------------------------------------
        # 4. Seed Applications & Evaluations across Students
        # -------------------------------------------------------------------------
        app_matrix = [
            # Job 0: Library (CoC, FHT, FIS, FTE)
            (0, 0, ApplicationStatus.APPROVED),
            (0, 5, ApplicationStatus.APPROVED),
            (0, 8, ApplicationStatus.APPROVED),
            (0, 11, ApplicationStatus.PENDING),

            # Job 1: IT Helpdesk (CoC, CoC, FTE)
            (1, 1, ApplicationStatus.APPROVED),
            (1, 2, ApplicationStatus.APPROVED),
            (1, 12, ApplicationStatus.REJECTED),

            # Job 2: Open House (FHT, FIS, CoC, FTE)
            (2, 6, ApplicationStatus.APPROVED),
            (2, 9, ApplicationStatus.APPROVED),
            (2, 3, ApplicationStatus.APPROVED),
            (2, 13, ApplicationStatus.PENDING),

            # Job 3: Sports Gym (CoC, FHT)
            (3, 4, ApplicationStatus.APPROVED),
            (3, 7, ApplicationStatus.APPROVED),

            # Job 4: International Conference (FIS, FHT, CoC)
            (4, 8, ApplicationStatus.APPROVED),
            (4, 10, ApplicationStatus.APPROVED),
            (4, 7, ApplicationStatus.APPROVED),

            # Job 5: Eco Campus (FTE, FTE, CoC)
            (5, 11, ApplicationStatus.APPROVED),
            (5, 12, ApplicationStatus.APPROVED),
            (5, 0, ApplicationStatus.PENDING),

            # Job 6: Language Workshop [COMPLETED] (FHT, FIS)
            (6, 5, ApplicationStatus.APPROVED),
            (6, 9, ApplicationStatus.APPROVED),

            # Job 8: Cafe Barista (FHT, CoC, FIS)
            (8, 6, ApplicationStatus.APPROVED),
            (8, 2, ApplicationStatus.APPROVED),
            (8, 10, ApplicationStatus.PENDING),

            # Job 9: Graphic Design (CoC, FIS)
            (9, 3, ApplicationStatus.APPROVED),
            (9, 8, ApplicationStatus.APPROVED),

            # Job 12: Botanical Research (FTE, FTE)
            (12, 11, ApplicationStatus.APPROVED),
            (12, 13, ApplicationStatus.APPROVED),

            # Job 16: Andamanda Phuket (FHT, FHT, CoC, FIS)
            (16, 5, ApplicationStatus.APPROVED),
            (16, 7, ApplicationStatus.APPROVED),
            (16, 1, ApplicationStatus.APPROVED),
            (16, 9, ApplicationStatus.PENDING),

            # Job 17: Central Phuket Food Fair (FHT, FIS, FTE)
            (17, 6, ApplicationStatus.APPROVED),
            (17, 8, ApplicationStatus.APPROVED),
            (17, 12, ApplicationStatus.APPROVED),

            # Job 18: Phuket Marathon (FTE, CoC, FHT)
            (18, 11, ApplicationStatus.APPROVED),
            (18, 2, ApplicationStatus.APPROVED),
            (18, 7, ApplicationStatus.APPROVED),

            # Job 20: Municipal Election [COMPLETED] (CoC, FIS, FTE)
            (20, 0, ApplicationStatus.APPROVED),
            (20, 9, ApplicationStatus.APPROVED),
            (20, 12, ApplicationStatus.APPROVED),

            # Job 21: EDC Music Fest [COMPLETED] (CoC, FHT, FIS)
            (21, 4, ApplicationStatus.APPROVED),
            (21, 6, ApplicationStatus.APPROVED),
            (21, 10, ApplicationStatus.APPROVED),

            # Job 24: Marine Cleanup (FTE, CoC, FHT)
            (24, 13, ApplicationStatus.APPROVED),
            (24, 1, ApplicationStatus.APPROVED),
            (24, 5, ApplicationStatus.PENDING),

            # Job 27: Airport Greeter (FIS, FHT)
            (27, 8, ApplicationStatus.APPROVED),
            (27, 10, ApplicationStatus.APPROVED),

            # Job 29: Aquarium Habitat [COMPLETED] (FTE, FHT)
            (29, 11, ApplicationStatus.APPROVED),
            (29, 7, ApplicationStatus.APPROVED),
        ]

        created_apps = []
        for job_idx, student_idx, status in app_matrix:
            if job_idx < len(seeded_jobs) and student_idx < len(students):
                job = seeded_jobs[job_idx]
                student = students[student_idx]

                app, _ = Application.objects.get_or_create(
                    student=student,
                    job=job,
                    defaults={'status': status}
                )
                created_apps.append(app)

                # Seed Evaluations for completed jobs
                if job.status == JobStatus.COMPLETED and status == ApplicationStatus.APPROVED:
                    Evaluation.objects.get_or_create(
                        application=app,
                        defaults={
                            'punctuality_rating': 5 if student_idx % 2 == 0 else 4,
                            'responsibility_rating': 5,
                            'grooming_rating': 5,
                            'quality_rating': 5 if student_idx % 3 != 0 else 4,
                            'comment': 'Demonstrated excellent diligence, punctuality, and teamwork throughout the assignment.',
                            'result_status': 'PASS',
                        }
                    )

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(created_apps)} student applications and evaluations.'))

        # -------------------------------------------------------------------------
        # 5. Export to seed_data.json Fixture
        # -------------------------------------------------------------------------
        if options['dump']:
            self.stdout.write(self.style.NOTICE('Exporting database state to backend/seed_data.json...'))
            try:
                import os
                from django.conf import settings
                fixture_path = os.path.join(settings.BASE_DIR, 'seed_data.json')
                with open(fixture_path, 'w', encoding='utf-8') as f:
                    call_command(
                        'dumpdata',
                        'auth.user',
                        'jobs.student',
                        'jobs.job',
                        'jobs.workschedule',
                        'jobs.application',
                        'jobs.evaluation',
                        indent=2,
                        stdout=f
                    )
                self.stdout.write(self.style.SUCCESS(f'Successfully dumped fixture to {fixture_path}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed to dump fixture: {e}'))

        self.stdout.write(self.style.SUCCESS('\n=== Database Seeding Complete! ==='))
        self.stdout.write('Summary:')
        self.stdout.write(f'  - Total Jobs:        {len(seeded_jobs)} (10 with curated stock thumbnails, 20 with fallback placeholder)')
        self.stdout.write(f'  - Total Students:    {len(students)} across 4 PSU faculties')
        self.stdout.write(f'  - Applications:      {len(created_apps)}')
        self.stdout.write('Accounts ready to use:')
        self.stdout.write('  - Admin:             username="admin"       password="admin123"')
        self.stdout.write('  - Staff:             username="staff"       password="staff123"')
        self.stdout.write('  - Students (14):     username="6630613001" to "6630613014" (including 6630613009) password="student123"\n')

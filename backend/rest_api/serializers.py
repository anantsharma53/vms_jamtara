from rest_framework import serializers
from .models import User,ApplicantInformation, Complaint, ComplaintImage,Department,ComplaintAction
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return User.objects.create(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
    
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'contactNumber','email','address','description']

class ComplaintImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintImage
        fields = ['id', 'image']



  
class ComplaintSerializer(serializers.ModelSerializer):
    images = ComplaintImageSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = Complaint
        fields = [
            'id', 'user', 'user_name',
            'name', 'mobile_number', 'email',
            'village', 'panchyat', 'pin_code',
            'post_office', 'police_station', 'district',
            'correspondentAddress', 'category',
            'complaint_text', 'resolution', 'feedback', 'created_at',
            'images', 'department', 'status',
            'forwarded_to', 'forward_remarks', 'rejection_remarks','accept_remarks','rejection_remarks',
            'forward_remarks','is_jantadarbar_complain',
        ]
        extra_kwargs = {
            'user': {'required': False},
            'resolution': {'required': False},
            'feedback': {'required': False},
            'is_jantadarbar_complain': {'required': False},
            'correspondentAddress': {'required': False},
            
        }

# class ComplaintActionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ComplaintAction
#         fields = '__all__'
class ComplaintActionSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source='performed_by.name', read_only=True)
    to_department_name = serializers.CharField(source='to_department.name', read_only=True)
    from_department_name = serializers.CharField(source='from_department.name', read_only=True)

    class Meta:
        model = ComplaintAction
        fields = [
            'id', 'action', 'remarks', 'timestamp', 
            'performed_by', 'performed_by_name',
            'to_department', 'to_department_name',
            'from_department', 'from_department_name',
            'action_details'
        ]

class FeedbackSerializer(serializers.Serializer):
    feedback = serializers.CharField(required=True, max_length=10000)




class ApplicantInformationSerializer(serializers.ModelSerializer):
    # Convert ImageField to URL format
    # image = serializers.ImageField(use_url=True)
    # signature = serializers.ImageField(use_url=True)
    # aadhar_card = serializers.ImageField(use_url=True)
    # pan_card = serializers.ImageField(use_url=True)
    # center_outside = serializers.ImageField(use_url=True)
    # center_inside = serializers.ImageField(use_url=True)
    # computer_certificate = serializers.ImageField(use_url=True)
    # authorised_certificate = serializers.ImageField(use_url=True)
    # application_form = serializers.ImageField(use_url=True)

    class Meta:
        model = ApplicantInformation
        fields = '__all__'  # Include all fields from the model

    def create(self, validated_data):
        # Generate application number before saving the instance
        last_application = ApplicantInformation.objects.order_by('id').last()
        application_number = f"JHARSEWA-{last_application.id + 1 if last_application else 1:06}"
        validated_data['application_number'] = application_number
        
        # Create the ApplicantInformation instance
        return super().create(validated_data)





class ApplicantFileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicantInformation
        fields = [
            'image',
            'signature',
            'aadhar_card',
            'pan_card',
            'center_outside',
            'center_inside',
            'computer_certificate',
            'authorised_certificate',
            'application_form'
        ]

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError("No files provided for upload.")
        return attrs






class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicantInformation
        exclude = ('image', 'signature', 'declaration') 

class AdmitCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicantInformation
        fields = '__all__'
          